import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Medium.com-style rich text editor powered by TipTap v3.
 * Features: fixed toolbar, inline image upload (drag/drop/paste/button), link insertion.
 */
const MediumEditor = ({ value, onChange, placeholder = 'Tell your story...' }) => {
    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { keepMarks: true },
                orderedList: { keepMarks: true },
            }),
            Underline,
            Image.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: { class: 'medium-editor-image' },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'medium-editor-link' },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'medium-editor-content',
            },
            handleDrop: (view, event) => {
                const files = event.dataTransfer?.files;
                if (files && files.length > 0) {
                    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
                    if (imageFiles.length > 0) {
                        event.preventDefault();
                        imageFiles.forEach(file => uploadAndInsertImage(file));
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (items) {
                    for (const item of items) {
                        if (item.type.startsWith('image/')) {
                            event.preventDefault();
                            const file = item.getAsFile();
                            if (file) uploadAndInsertImage(file);
                            return true;
                        }
                    }
                }
                return false;
            },
        },
    });

    const uploadAndInsertImage = useCallback(async (file) => {
        if (!editor) return;
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                editor.chain().focus().setImage({ src: `${API}${data.url}`, alt: file.name }).run();
            }
        } catch (err) {
            console.error('Image upload failed:', err);
        }
    }, [editor]);

    const triggerImageUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadAndInsertImage(file);
            e.target.value = '';
        }
    }, [uploadAndInsertImage]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', prev || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor]);

    if (!editor) return null;

    // Toolbar button helper
    const Btn = ({ onClick, active, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            className={`medium-toolbar-btn ${active ? 'is-active' : ''}`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="medium-editor-wrapper">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Fixed Toolbar */}
            <div className="medium-toolbar">
                <div className="medium-toolbar-group">
                    <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">H1</Btn>
                    <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</Btn>
                    <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</Btn>
                </div>
                <span className="toolbar-divider" />
                <div className="medium-toolbar-group">
                    <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><strong>B</strong></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><span style={{ textDecoration: 'underline' }}>U</span></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><span style={{ textDecoration: 'line-through' }}>S</span></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">{'<>'}</Btn>
                </div>
                <span className="toolbar-divider" />
                <div className="medium-toolbar-group">
                    <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">• List</Btn>
                    <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">1.</Btn>
                    <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">"</Btn>
                    <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">{'{ }'}</Btn>
                </div>
                <span className="toolbar-divider" />
                <div className="medium-toolbar-group">
                    <Btn onClick={triggerImageUpload} title="Upload Image">📷</Btn>
                    <Btn onClick={setLink} active={editor.isActive('link')} title="Insert Link">🔗</Btn>
                    <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">―</Btn>
                </div>
            </div>

            {/* Editor content area */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default MediumEditor;
