import email
import os
import smtplib
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

load_dotenv()

sending_email_address = os.getenv('SENDING_EMAIL_ADDRESS')
sending_email_password = os.getenv('SENDING_EMAIL_PASSWORD')



class EMAIL_AGENT:

    def __init__(self):
        self.username = sending_email_address
        self.password = sending_email_password

    def send_email(self, email_subject, email_text, receiving_email, content_type="html", attachments=None):
        # Email settings
        sender_email = self.username
        receiver_email = receiving_email
        password = self.password
        smtp_server = "smtp.gmail.com"
        port = 465
        # smtp_server = " smtp.titan.email"
        # port = 465

        message = MIMEMultipart("alternative")
        message["Subject"] = email_subject

        # Format "From" field to include sender's name
        sender_name = "InfraEstate AI "
        sender_email = sender_email
        message["From"] = email.utils.formataddr((sender_name, sender_email))


        message["To"] = receiver_email

        text = email_text

        part1 = MIMEText(text, content_type)
        message.attach(part1)

        # Attach inline images
        if attachments:
            for cid, filepath in attachments.items():
                with open(filepath, "rb") as img:
                    img_data = img.read()
                    image = MIMEImage(img_data)
                    image.add_header("Content-ID", f"<{cid}>")
                    message.attach(image)

        try:
            server = smtplib.SMTP_SSL(smtp_server, port)
            # server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiving_email, message.as_string())
            server.quit()
            return "Successfully sent email"
        except Exception as e:
            return f"Error: {e}"

if __name__ == "__main__":
    agent = EMAIL_AGENT()
    subject = "Test Email"
    email_content = "This is a test email from Mail Service"
    recipient_email = 'muzammilpervaiz45@gmail.com'  # Replace with actual recipient email
    response = agent.send_email(subject, email_content, recipient_email)
    print(response)

#
