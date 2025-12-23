'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

import type { Editor } from '@tiptap/react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 flex-wrap bg-neutral-50 p-2 border-b border-neutral-200 rounded-t-xl">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${
                    editor.isActive('bold')
                        ? 'bg-dark-primary text-white'
                        : 'hover:bg-white text-neutral-600 hover:text-dark-primary'
                }`}
                title="Bold"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
                    />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${
                    editor.isActive('italic')
                        ? 'bg-dark-primary text-white'
                        : 'hover:bg-white text-neutral-600 hover:text-dark-primary'
                }`}
                title="Italic"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 4h4m0 16h-4m2-16l-2 16"
                    />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-lg transition-colors ${
                    editor.isActive('underline')
                        ? 'bg-dark-primary text-white'
                        : 'hover:bg-white text-neutral-600 hover:text-dark-primary'
                }`}
                title="Underline"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8v6a5 5 0 0010 0V8M5 21h14"
                    />
                </svg>
            </button>

            <div className="w-px h-6 bg-neutral-300 mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg transition-colors ${
                    editor.isActive('bulletList')
                        ? 'bg-dark-primary text-white'
                        : 'hover:bg-white text-neutral-600 hover:text-dark-primary'
                }`}
                title="Bullet List"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg transition-colors ${
                    editor.isActive('orderedList')
                        ? 'bg-dark-primary text-white'
                        : 'hover:bg-white text-neutral-600 hover:text-dark-primary'
                }`}
                title="Numbered List"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h10m-10 4h10M3 8h.01M3 12h.01M3 16h.01"
                    />
                </svg>
            </button>

            <div className="w-px h-6 bg-neutral-300 mx-1" />

            <button
                type="button"
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
                className={`p-2 rounded-lg transition-colors ${
                    editor.isActive('link')
                        ? 'bg-dark-primary text-white'
                        : 'hover:bg-white text-neutral-600 hover:text-dark-primary'
                }`}
                title="Add Link"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                </svg>
            </button>

            <select
                onChange={(e) => {
                    if (e.target.value === 'p') {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({
                                level: parseInt(e.target.value) as 1 | 2 | 3,
                            })
                            .run();
                    }
                }}
                className="ml-2 text-sm border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-dark-primary"
                defaultValue="p"
            >
                <option value="p">Paragraph</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
            </select>
        </div>
    );
};

const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Enter description...',
    className = '',
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4',
            },
        },
    });

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div
            className={`rich-text-editor border border-neutral-200 rounded-xl overflow-hidden ${className}`}
        >
            <MenuBar editor={editor} />
            <div className="bg-white">
                <EditorContent editor={editor} placeholder={placeholder} />
            </div>
            <style jsx global>{`
                .rich-text-editor .ProseMirror {
                    min-height: 150px;
                    padding: 1rem;
                }
                .rich-text-editor .ProseMirror:focus {
                    outline: none;
                }
                .rich-text-editor
                    .ProseMirror
                    p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .rich-text-editor .ProseMirror ul,
                .rich-text-editor .ProseMirror ol {
                    padding-left: 1.5rem;
                }
                .rich-text-editor .ProseMirror ul {
                    list-style-type: disc;
                }
                .rich-text-editor .ProseMirror ol {
                    list-style-type: decimal;
                }
                .rich-text-editor .ProseMirror a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                .rich-text-editor .ProseMirror h1 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor .ProseMirror h2 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor .ProseMirror h3 {
                    font-size: 1.1rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
