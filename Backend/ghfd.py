import json
import mimetypes
import os
import time
import uuid
from io import BytesIO
from typing import Optional

from PIL import Image, ImageFile
from fastapi import HTTPException, UploadFile, File, APIRouter
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
from pydantic import BaseModel

# Allow PIL to load truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Initialize your Gemini client
API_KEY = "..."
client = genai.Client(api_key=API_KEY)

# Define your design preferences
DESIGN_PREFERENCES = {
    "Modern": "Clean lines, neutral palette with occasional warm wood accents, sleek built‑in storage, and maximized natural light.",
    "Modern Minimalist": "Simple geometric forms and clean lines, a neutral white‑and‑gray palette, light wood accents, minimal decorative pieces, and plenty of natural light.",
    "Subtle Pakistani Touch": "Understated local craftsmanship—handwoven cushions or a small jali screen—paired with neutral walls, modest wood furniture.",
    "Contemporary Casual": "Blend of modern silhouettes with easy‑care fabrics, simple accent pillows, streamlined storage, and modest pops of color.",
    "Soft Industrial": "Light concrete or faux‑brick feature wall, black metal frames on shelves, upholstered seating in neutral tones, simple Edison‑style bulbs.",
    "Scandi‑Cozy": "Light-colored laminate or engineered wood floors, clean white walls, cozy throws and rugs, simple pendant lighting, minimal decor.",
    "Relaxed Boho": "Casual mix of patterned cushions, simple area rug, potted plants, light macramé accents, and low‑cost furniture with rounded lines."
}


def generate_floor_plan_prompt(plot_size, bedrooms, kitchen, living_area, additional_features=None):
    """
    Generates a detailed prompt for creating a 2D floor plan based on user specifications.

    Parameters:
    - plot_size (str): Plot size ('5 Marla', '10 Marla', '1 Kanal')
    - bedrooms (int): Number of bedrooms
    - additional_features (list, optional): Additional features like 'lawn', 'garage'

    Returns:
    - str: Detailed prompt for floor plan generation
    """

    # Define standard plot dimensions
    plot_dimensions = {
        "5 Marla": (25, 45),
        "10 Marla": (35, 65),
        "1 Kanal": (50, 90)
    }

    # Validate plot size
    if plot_size not in plot_dimensions:
        raise ValueError("Invalid plot size. Choose fgrom '5 Marla', '10 Marla', or '1 Kanal'.")

    width, length = plot_dimensions[plot_size]

    prompt = (
        f"Design a clean, high-resolution 2D floor plan (House Footprint) for a {plot_size} property. "
        f"The overall plot dimensions are {width} feet by {length} feet; display these dimensions only once clearly beside the plan "
        f"as {width}' x {length}'. Do not include any other text labels, numbers, or measurements on the plan itself. "
        f"The layout should include:\n"
        f"- {bedrooms} bedrooms with attach bathrooms\n"
        f"- {living_area} living room(s)\n"
        f"- {kitchen} kitchen(s)\n"
    )
    # Detailed room specifications
    prompt += (
        "Each bedroom should be spacious enough to accommodate a bed, bedside tables, and a wardrobe. "
        "Bathrooms should include standard fixtures: a toilet, sink, and shower area. "
        "The kitchen should have counter space, a sink, and areas designated for appliances. "
        "The living room should be centrally located, providing ample space for seating arrangements. "
    )

    # Design guidelines
    prompt += (
        "Use solid black lines to represent walls, ensuring doors clearly marked. "
        "Avoid including any text labels or measurements within the floor plan to maintain clarity. "
        "Incorporate basic furniture layouts to indicate room functions without overcrowding the design. "
        "Maintain a flat, minimalistic, and well-aligned aesthetic, using simple floor textures to distinguish different spaces. "
        f"Only show the full plot size/dimensions beside the floor plan like ({width}'' x {length}'') "
        "Do Not write any Text or Label on the floor plan, Make sure its clean and clear to understand. Furniture should be minimal, just enough to identify the room function without overcrowding.The final layout must be clear, symmetrical, well-balanced, and professionally formatted like an architectural drawing. Just as shown in the reference image."
    )

    return prompt


router = APIRouter(tags=["Floor Plan Generator"])


def save_binary_file(file_name: str, data: bytes):
    with open(file_name, "wb") as f:
        f.write(data)


def generate_image(prompt: str, reference_image: Image.Image) -> Image.Image:
    """
    Calls the Google GenAI API with the provided prompt and reference image.
    Returns the generated PIL Image.
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash-exp-image-generation",
        contents=[prompt, reference_image],
        config=types.GenerateContentConfig(
            temperature=0.0,
            top_k=1,
            top_p=0.0,
            seed=10,
            candidate_count=1,
            response_modalities=['Text', 'Image']
        )
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            return Image.open(BytesIO(part.inline_data.data))
    raise Exception("Image generation failed. No inline image data received.")




def generate_3d_image_function(prompt: str, reference_image: Image.Image) -> Image.Image:
    """
    Calls the Google GenAI API with the provided prompt and reference image.
    Returns the generated PIL Image.
    """

    API_KEY = "..."
    g_client = genai.Client(api_key=API_KEY)


    response = g_client.models.generate_content(
        model="gemini-2.0-flash-exp-image-generation",
        contents=[prompt, reference_image],
        config=types.GenerateContentConfig(
            temperature=0.0,
            top_k=0.0,
            top_p=0.0,
            seed=10,
            candidate_count=1,
            response_modalities=['Text', 'Image']
        )
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            return Image.open(BytesIO(part.inline_data.data))
    raise Exception("Image generation failed. No inline image data received.")



from typing import List


def easy_layout_prompts(
        plot_size: str,
        bedrooms: int,
        kitchens: int,
        living_rooms: int,
        additional: List[str] | None = None,
) -> List[str]:
    """
    Return four prompt variants (A-D).  Variants B & C are unchanged;
    Variants A & D have been simplified for better, count-accurate output.
    """
    dims = {"5 Marla": (25, 45), "10 Marla": (35, 65), "1 Kanal": (50, 90)}
    if plot_size not in dims:
        raise ValueError("plot_size must be 5 Marla, 10 Marla, or 1 Kanal")
    w, l = dims[plot_size]

    addons = {a.lower() for a in (additional or [])}
    need_garage = "garage" in addons
    need_lawn = "lawn" in addons
    need_ac = "air_conditioned" in addons

    # ─── Hard constraints common to every variant ────────────────────
    core = (
        f"Draw a **single-storey, right-angle 2-D floor plan** for a **{w}’ × {l}’ "
        f"{plot_size} plot**.  Show those exterior dimensions once beside the drawing only.\n\n"
        "### EXACT room programme (do not add or omit)\n"
        f"• {bedrooms} bedroom(s)  • {living_rooms} living/family room(s)  • {kitchens} kitchen(s)\n"
        "• Attach a private bath to each bedroom if possible; otherwise provide ONE centrally-located shared bath.\n"
        "• No extra enclosed rooms are allowed (stores, studies, etc.).\n\n"
        "### Drawing rules\n"
        "• Black, solid walls; clear door swings; thin, minimal furniture symbols.\n"
        "• NO text, labels, or extra numbers inside the plan.\n"
        "• Keep geometry rectangular; no curves, offsets, or cantilevers for easy construction.\n"
    )

    if need_garage:
        core += "• Include a single-car garage (≈10’×18’) on the road frontage.\n"
    if need_lawn:
        core += "• Reserve a rectangular lawn front or rear (light grass hatch, no text).\n"
    if need_ac:
        core += "• Place each bedroom on an exterior wall so split-AC units vent straight outside.\n"

    # ─── Variant A •  “Front-Open Rectangle”  (replaces old central hallway) ───
    v1 = core + (
        "\n### VARIANT A — Front-open rectangle\n"
        "• Use one simple rectangular footprint that fills the allowable plot.\n"
        "• Place an open-plan living + kitchen zone across the full **front width** (street side), "
        "so the kitchen island and sofa share one large 18-20 ft-deep space.\n"
        "• Run a single straight corridor behind that zone; locate all bedrooms along the back wall, "
        "each accessed from that corridor.\n"
        "• Align all interior walls perpendicular to exterior walls so beams are straightforward."
    )

    # ─── Variant B • Side-Corridor Rectangle  (new) ──────────────────
    v2 = core + (
        "\n### VARIANT B — Side-corridor rectangle\n"
        f"REPEAT ROOMS: **{bedrooms} BED • {living_rooms} LIVING • {kitchens} KITCHEN — NO EXTRAS.**\n"
        "• Same rectangular footprint as Variant A.\n"
        "• A 4-ft corridor hugs the **left** long wall from front to back.\n"
        "    – Corridor LEFT wall = exterior; RIGHT side of corridor contains every room.\n"
        "• From front to rear, order the spaces like blocks on a shelf:\n"
        "    1. Living room (full width minus corridor)\n"
        "    2. Kitchen (full width minus corridor)\n"
        f"    3…{bedrooms + 2}. Bedrooms (equal widths), each doorway opens onto the corridor.\n"
        "• Baths back-to-back on one plumbing wall.  Corridor + straight spans ⇒ fast construction."
    )

    # ─── Variant C • Back-Open Rectangle  (new) ──────────────────────
    v3 = core + (
        "\n### VARIANT C — Back-open rectangle (mirror of A)\n"
        f"RESTATE: **{bedrooms} BED • {living_rooms} LIVING • {kitchens} KITCHEN — NOTHING ELSE.**\n"
        "• Same single rectangle, but flip the functional stack:\n"
        "    – **Rear full-width** = open-plan living + kitchen (garden view).\n"
        "    – Single corridor runs directly in front of that zone.\n"
        "    – All bedrooms line the **front/street wall**; doors open onto the corridor.\n"
        "• Perfect mirror of Variant A, giving a second layout style while staying count-accurate."
    )

    # ─── Variant D • Two-Band Front-/Back Split  (simplified) ────────
    v4 = core + (
        "\n### VARIANT D — Two-band front/back split\n"
        f"ROOMS AGAIN: **{bedrooms} BED • {living_rooms} LIVING • {kitchens} KITCHEN — NO OTHERS.**\n"
        "• Slice the rectangle into **Band-1 (front)** and **Band-2 (rear)**, each 18-22 ft deep.\n"
        "• Band-1 (front/street): ALL bedrooms placed side-by-side; attach baths in a single plumbing line.\n"
        "• Band-2 (rear/garden): the sole living room plus the sole kitchen share one open space.\n"
        "• A 4-ft service verandah runs along the rear of Band-2 for outdoor access; no interior corridor needed.\n"
        "• Only straight walls and square corners → cheapest slab, fastest build."
    )

    return [v1, v2, v3, v4]




class FloorPlanRequest(BaseModel):
    plot_size: str  # '5 Marla' | '10 Marla' | '1 Kanal'
    bedrooms: int
    kitchen: int  # 🡆 plural arg in helper is ‘kitchens’
    living_area: int  # 🡆 plural arg in helper is ‘living_rooms’
    additional_features: Optional[List[str]] = None  # ['garage', …]


# 2️⃣ ───────── endpoint ─────────────────────────────────────────────
@router.post("/generate-floorplan", summary="Generate 2D Floor-Plan Variants")
def generate_floorplan_endpoint(req: FloorPlanRequest):
    """
    Generates *four* 2-D floor-plan variants (A-D) based on the
    provided specs.  Returns JSON with the file paths of each PNG.
    """
    try:

        # A. build four prompt variants
        prompts = easy_layout_prompts(
            plot_size=req.plot_size,
            bedrooms=req.bedrooms,
            kitchens=req.kitchen,
            living_rooms=req.living_area,
            additional=req.additional_features,
        )


        # B. load reference footprint once
        ref_image = Image.open("sample_footprint.jpg")

        file_paths = []
        letters = ["A", "B", "C", "D"]

        # C. generate & persist each variant
        for idx, prompt in enumerate(prompts):
            img = generate_image(prompt, ref_image)  # your diffusion / CAD fn
            uid = uuid.uuid4().hex
            fname = f"static/{req.plot_size}_{uid}_variant-{letters[idx]}.png"
            img.save(fname, format="PNG")
            file_paths.append(fname)
            # time.sleep(5)

        # D. return list of paths (could also return URLs if behind CDN)
        return JSONResponse({"files": file_paths})

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# class FloorPlanRequest(BaseModel):
#     plot_size: str
#     bedrooms: int
#     kitchen: int
#     living_area: int
#     additional_features: Optional[List[str]] = None
#
#
# @router.post("/generate-floorplan", summary="Generate 2D Floor Plan")
# def generate_floorplan_endpoint(request: FloorPlanRequest):
#     """
#     Generates a 2D floor plan image based on provided specifications,
#     saves the image locally, and returns the saved image file.
#     """
#     try:
#         # Generate the 2D floor plan prompt
#         prompt = generate_floor_plan_prompt(
#             plot_size=request.plot_size,
#             bedrooms=request.bedrooms,
#             kitchen=request.kitchen,
#             living_area=request.living_area,
#             additional_features=request.additional_features
#         )
#
#         # Load the reference image from disk (adjust the path as necessary)
#         ref_image = Image.open("sample_footprint.jpg")
#
#         # Generate the 2D floor plan
#         image_2d = generate_image(prompt, ref_image)
#
#         id = str(uuid.uuid4())
#
#         # Save the generated 2D floor plan image to disk
#         result_file_path = f"static/{request.plot_size}_{id}_2d_result.png"
#         image_2d.save(result_file_path, format="PNG")
#
#         # Return the saved file as a file response
#         return FileResponse(result_file_path, media_type="image/png", filename="result.png")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-measurement-plan", summary="Generate Measurement Plan from 2D Floor Plan")
def generate_measurement_plan(file: UploadFile = File(...)):
    """
    Takes the uploaded 2D floor plan image and returns its measurement details
    (text and annotated image).
    """
    try:
        # Read the uploaded file bytes and open it as a PIL Image
        image_data = file.file.read()
        ref_image = Image.open(BytesIO(image_data))

        measurement_prompt = (
            "**Task:** Add numeric labels to a floor plan and provide detailed measurements as text.\n\n"
            "**Input:** A 2D floor plan image.\n\n"
            "**Instructions:**\n"
            "1. **NUMERIC ROOM LABELS:** Add only numbered labels to each distinct room/space.\n"
            "   - Use simple numbers (1, 2, 3, etc.) placed in a visible area of each room\n"
            "   - Do NOT add room names or functions on the image itself\n\n"


            "2. **DETAILED TEXT DESCRIPTION:** Provide a separate text output with:\n"
            "   - Overall dimensions: \"Total exterior dimensions: XX' × YY'\"\n"
            "   - Detailed room descriptions by number: \"Room 1 (Kitchen): 10' × 12', with [features]\"\n"
            "   - Include room function, precise measurements, and notable features for each room\n"
            "   - List all measurements in feet and inches when appropriate (e.g., 10'6\" × 12')\n\n"
            "3. **CRITICAL GUIDELINES:**\n"
            "   - Keep image annotations minimal - ONLY numbers \n"
            "   - Do NOT add any text to rooms other than numbers\n"
            "   - Provide all detailed descriptions and measurements in text output only\n"
            "   - Be precise and accurate with measurements\n\n"
            "**Expected Output:**\n"
            "1. Floor plan image with: numbered rooms \n"
            "2. Text description with: total dimensions + detailed room-by-room measurements and features"
        )

        # Generate the content using the Gemini API
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp-image-generation",
            contents=[measurement_prompt, ref_image],
            config=types.GenerateContentConfig(
                temperature=0.0,
                top_k=1,
                top_p=0.0,
                seed=10,
                candidate_count=1,
                response_modalities=["Text", "Image"]
            )
        )
        # time.sleep(5)

        # Extract the text and image parts
        result = {}
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                result["text"] = part.text  # Extract text (measurement description)
            elif part.inline_data is not None:
                file_name = f"annotated_floorplan_{uuid.uuid4()}.png"
                save_binary_file(f"static/{file_name}", part.inline_data.data)  # Save annotated image
                result["image"] = f"/static/{file_name}"  # URL of the saved image

        if "text" not in result or "image" not in result:
            raise HTTPException(status_code=500, detail="Failed to generate text or image.")

        # Return both the text description and the image URL
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-3d-plan", summary="Generate 3D Floor Plan")
def generate_3d_plan(file: UploadFile = File(...)):
    """
    Takes a 2D floor plan image and generates a 3D visualization of it.
    """
    try:
        image_data = file.file.read()
        image_2d = Image.open(BytesIO(image_data))

        conversion_prompt = (
            "Convert this 2D house floor plan into a realistic 3D visualization. "
            "Extrude walls and elevate structural elements to depict accurate height and depth. "
            "Add realistic textures to walls, floors, and ceilings. Include architectural features "
            "like doors, windows, stairs (if any), and roof design. Decorate rooms with appropriate "
            "furniture and interior elements to reflect a livable, furnished space. Maintain correct "
            "proportions and overall layout as per the original footprint."
        )

        image_3d = generate_3d_image_function(conversion_prompt, image_2d)

        # Save the 3D visualization
        output_file_path = f"static/generated_3d_plan_{str(uuid.uuid4())}.png"
        image_3d.save(output_file_path, format="PNG")

        return FileResponse(output_file_path, media_type="image/png", filename="generated_3d_plan.png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_interior_prompts(floorplan_path: Image.Image, preference_key: str) -> dict:
    """
    Generates interior design prompts tailored to the user's selected preference.
    This function processes the uploaded 2D floor plan and the selected preference.
    """
    # Validate preference
    if preference_key not in DESIGN_PREFERENCES:
        raise ValueError(f"Unknown preference '{preference_key}'. Choose from: {list(DESIGN_PREFERENCES)}")

    preference_desc = DESIGN_PREFERENCES[preference_key]

    system_instruction = (
        f"You are a world‑class interior designer specializing in **{preference_key}** style.  "
        f"{preference_desc}  "
        "Given the floor‑plan image and its room measurements JSON, "
        "generate for each room an ultra‑detailed, photorealistic prompt "
        "suitable for a state‑of‑the‑art AI image generator.  "
        "Each prompt must specify:\n"
        "  • Premium finishes & materials\n"
        "  • Cohesive color palette\n"
        "  • Lighting scheme\n"
        "  • Furniture layout, scale, and key décor elements\n\n"
        "Output **only** a JSON object with a top‑level `rooms` array.  "
        "Each element must include exactly:\n"
        "  • `room_id` (string)\n"
        "  • `room_type` (string)\n"
        "  • `design_prompt` (string)\n"
    )

    # Schema for strict, predictable JSON
    schema = {
        "type": "object",
        "properties": {
            "rooms": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "room_id": {"type": "string"},
                        "room_type": {"type": "string"},
                        "design_prompt": {"type": "string"}
                    },
                    "required": ["room_id", "room_type", "design_prompt"]
                },
                "minItems": 1
            }
        },
        "required": ["rooms"]
    }



    API_KEY = "..."
    interior_client = genai.Client(api_key=API_KEY)



    # Call Gemini API with both the system instruction and reference image
    resp = interior_client.models.generate_content(
        model="gemini-2.0-flash-exp-image-generation",
        contents=[
            system_instruction,
            floorplan_path
        ],
        config={
            "response_mime_type": "application/json",
            "response_schema": schema,
            "temperature": 0.25,
            "top_p": 0.95,
            "seed": 2025,
            "candidate_count": 1
        }
    )
    time.sleep(2)

    return json.loads(resp.text)


def generate_interior_images(prompts_json: dict, output_dir: str = "interior_designs") -> dict:
    """
    Loops over the prompts JSON and generates interior design images based on room prompts.
    Saves images and returns a dictionary of image paths.
    """
    os.makedirs(output_dir, exist_ok=True)
    saved_paths = {}

    for room in prompts_json["rooms"]:
        rid = room["room_id"]
        prompt = room["design_prompt"]

        img_resp = client.models.generate_content(
            model="gemini-2.0-flash-exp-image-generation",
            contents=[prompt],
            config=types.GenerateContentConfig(
                temperature=0.0,
                top_k=1,
                top_p=0.0,
                seed=10,
                candidate_count=1,
                response_modalities=['Text', 'Image']
            )
        )
        time.sleep(5)

        for part in img_resp.candidates[0].content.parts:
            if part.inline_data:
                ext = mimetypes.guess_extension(part.inline_data.mime_type) or ".png"
                fname = f"{rid}_{str(uuid.uuid4())}_{ext}"
                path = os.path.join(output_dir, fname)
                with open(path, "wb") as f:
                    f.write(part.inline_data.data)
                saved_paths[rid] = path

    return saved_paths


@router.post("/generate-design-image", summary="Generate Interior Design Image")
def generate_design_image(file: UploadFile = File(...), design_preference: str = "Modern Minimalist"):
    """
    Generates an interior design image based on the selected design preference.
    Accepts an uploaded 2D floor plan image and a design preference (e.g., 'Modern Minimalist').
    """
    try:
        # Validate preference
        if design_preference not in DESIGN_PREFERENCES:
            raise HTTPException(status_code=400, detail="Invalid design preference. Please choose a valid option.")

        # Read the uploaded file (2D floor plan image)
        image_data = file.file.read()
        image_2d = Image.open(BytesIO(image_data))

        # Generate design prompts based on the selected preference
        prompts = generate_interior_prompts(floorplan_path=image_2d, preference_key=design_preference)

        # Generate and save interior design images
        images = generate_interior_images(prompts, output_dir="static")

        print(images)

        # Return the paths to generated design images
        return {"images": images}  # List of paths to generated design images

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
