import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Markdown.css';

// Function to check if a line has RTL characters
const isRTL = (text) => {
    const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlChars.test(text);
};

const Markdown = ({markdownText, isBotMessage}) => {
    // Split content by new lines to handle mixed language lines
    const splitText = markdownText.split('\n');

    return (
        <div className="markdown-wrapper">
            {splitText.map((line, index) => {
                const rtl = isRTL(line);
                return (
                    <div
                        key={index}
                        className={rtl ? 'rtl-line' : 'ltr-line'}
                        style={{
                            textAlign: rtl ? 'right' : 'left',
                            direction: rtl ? 'rtl' : 'ltr',
                        }}
                    >
                        <ReactMarkdown
                            components={{
                                // Style code blocks
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || 'language-js');
                                    const language = match ? match[1] : '';

                                    return !inline ? (
                                        <div className="code-block-wrapper">
                                            {language && (
                                                <div className="code-language-tag">
                                                    {language}
                                                </div>
                                            )}
                                            <SyntaxHighlighter
                                                {...props}
                                                style={atomDark}
                                                language={language}
                                                PreTag="div"
                                                className="code-block"
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code {...props} className={`inline-code ${className || ''}`}>
                                            {children}
                                        </code>
                                    );
                                },

                                // Style links
                                a({node, children, href, ...props}) {
                                    return (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="markdown-link"
                                            {...props}
                                        >
                                            {children}
                                        </a>
                                    );
                                },

                                // Style images
                                img({node, alt, src, ...props}) {
                                    return (
                                        <div className="markdown-image-container">
                                            <img
                                                src={src}
                                                alt={alt || 'Image'}
                                                className="markdown-image"
                                                loading="lazy"
                                                {...props}
                                            />
                                            {alt && <div className="markdown-image-caption">{alt}</div>}
                                        </div>
                                    );
                                },

                                // Style headings
                                h1({node, children, ...props}) {
                                    return <h1 className="markdown-heading markdown-h1" {...props}>{children}</h1>;
                                },
                                h2({node, children, ...props}) {
                                    return <h2 className="markdown-heading markdown-h2" {...props}>{children}</h2>;
                                },
                                h3({node, children, ...props}) {
                                    return <h3 className="markdown-heading markdown-h3" {...props}>{children}</h3>;
                                },
                                h4({node, children, ...props}) {
                                    return <h4 className="markdown-heading markdown-h4" {...props}>{children}</h4>;
                                },

                                // Style lists
                                ul({node, children, ...props}) {
                                    return <ul className="markdown-list markdown-ul" {...props}>{children}</ul>;
                                },
                                ol({node, children, ...props}) {
                                    return <ol className="markdown-list markdown-ol" {...props}>{children}</ol>;
                                },
                                li({node, children, ...props}) {
                                    return <li className="markdown-list-item" {...props}>{children}</li>;
                                },

                                // Style blockquotes
                                blockquote({node, children, ...props}) {
                                    return <blockquote
                                        className="markdown-blockquote" {...props}>{children}</blockquote>;
                                },

                                // Style tables
                                table({node, children, ...props}) {
                                    return <div className="markdown-table-container">
                                        <table className="markdown-table" {...props}>{children}</table>
                                    </div>;
                                },
                                thead({node, children, ...props}) {
                                    return <thead className="markdown-thead" {...props}>{children}</thead>;
                                },
                                tbody({node, children, ...props}) {
                                    return <tbody className="markdown-tbody" {...props}>{children}</tbody>;
                                },
                                tr({node, children, ...props}) {
                                    return <tr className="markdown-tr" {...props}>{children}</tr>;
                                },
                                th({node, children, ...props}) {
                                    return <th className="markdown-th" {...props}>{children}</th>;
                                },
                                td({node, children, ...props}) {
                                    return <td className="markdown-td" {...props}>{children}</td>;
                                },

                                // Style paragraphs
                                p({node, children, ...props}) {
                                    return <p className="markdown-paragraph" {...props}>{children}</p>;
                                },
                            }}
                        >
                            {line || ' '}
                        </ReactMarkdown>
                    </div>
                );
            })}
        </div>
    );
};

Markdown.propTypes = {
    markdownText: PropTypes.string.isRequired,
    isBotMessage: PropTypes.bool,
};

export default Markdown;