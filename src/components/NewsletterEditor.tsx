import React, { useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link2, Heading2,
    Send, Search, Calendar, Users
} from 'lucide-react';

interface Submission {
    id: number;
    name: string;
    email: string;
    subscribe_updates: boolean;
    created_at?: string;
}

interface Props {
    submissions: Submission[];
    token: string;
    apiUrl: string;
}

const DURATION_OPTIONS = [
    { label: 'All time', value: 'all' },
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 30 days', value: '30' },
    { label: 'Last 90 days', value: '90' },
];

export default function NewsletterEditor({ submissions, token, apiUrl }: Props) {
    const [subject, setSubject] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const [duration, setDuration] = useState('all');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
        ],
        content: '<p>Write your newsletter here...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[220px] px-4 py-3 focus:outline-none text-[#2C2C2C] dark:text-gray-200',
            },
        },
    });

    const subscribers = useMemo(() => {
        const now = new Date();
        return submissions.filter(s => {
            if (!s.subscribe_updates) return false;
            const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.email.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) return false;
            if (duration === 'all' || !s.created_at) return true;
            const days = parseInt(duration);
            const created = new Date(s.created_at);
            return (now.getTime() - created.getTime()) <= days * 24 * 60 * 60 * 1000;
        });
    }, [submissions, search, duration]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editor) return;
        setSending(true);
        setStatus(null);
        try {
            const res = await fetch(`${apiUrl}/api/admin/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ subject, body: editor.getHTML() }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', message: `Sent to ${data.sent} subscriber(s)${data.failed ? `, ${data.failed} failed` : ''}` });
                setSubject('');
                editor.commands.setContent('<p>Write your newsletter here...</p>');
            } else {
                setStatus({ type: 'error', message: data.detail || 'Failed to send' });
            }
        } catch {
            setStatus({ type: 'error', message: 'Could not connect to backend' });
        } finally {
            setSending(false);
        }
    };

    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url) editor?.chain().focus().setLink({ href: url }).run();
    };

    const ToolbarBtn = ({ onClick, active, children }: { onClick: () => void, active?: boolean, children: React.ReactNode }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded-lg transition-all ${active ? 'bg-[#FF4B8C]/20 text-[#FF4B8C]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Compose Panel */}
            <form onSubmit={handleSend} className="xl:col-span-3 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg dark:text-white">Compose Newsletter</h3>
                </div>

                <div className="p-5 space-y-4 flex-1">
                    <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Subject line..."
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#FF4B8C] outline-none text-sm"
                    />

                    {/* Toolbar */}
                    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>
                            <Bold className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>
                            <Italic className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')}>
                            <UnderlineIcon className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')}>
                            <Strikethrough className="w-4 h-4" />
                        </ToolbarBtn>
                        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>
                            <Heading2 className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>
                            <List className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')}>
                            <ListOrdered className="w-4 h-4" />
                        </ToolbarBtn>
                        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })}>
                            <AlignLeft className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })}>
                            <AlignCenter className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })}>
                            <AlignRight className="w-4 h-4" />
                        </ToolbarBtn>
                        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                        <ToolbarBtn onClick={setLink} active={editor?.isActive('link')}>
                            <Link2 className="w-4 h-4" />
                        </ToolbarBtn>
                        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                        <input
                            type="color"
                            title="Text color"
                            className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            onChange={e => editor?.chain().focus().setColor(e.target.value).run()}
                        />
                    </div>

                    {/* Editor */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[220px]">
                        <EditorContent editor={editor} />
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    {status && (
                        <p className={`text-sm text-center ${status.type === 'success' ? 'text-green-500' : 'text-red-400'}`}>
                            {status.message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-[#FF4B8C] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#FF4B8C]/90 transition-all disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        {sending ? 'Sending...' : `Send to ${subscribers.length} subscriber(s)`}
                    </button>
                </div>
            </form>

            {/* Subscribers Panel */}
            <div className="xl:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg dark:text-white">Subscribers</h3>
                        <span className="flex items-center gap-1 text-xs bg-[#FF4B8C]/10 text-[#FF4B8C] px-2 py-1 rounded-full font-medium">
                            <Users className="w-3 h-3" /> {subscribers.length}
                        </span>
                    </div>
                    {/* Search */}
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name or email..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white text-sm focus:ring-2 focus:ring-[#FF4B8C] outline-none"
                        />
                    </div>
                    {/* Duration filter */}
                    <div className="flex gap-1 flex-wrap">
                        {DURATION_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setDuration(opt.value)}
                                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${duration === opt.value ? 'bg-[#FF4B8C] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                <Calendar className="w-3 h-3" /> {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 max-h-[520px]">
                    {subscribers.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-10">No subscribers found</p>
                    ) : (
                        subscribers.map(s => (
                            <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium dark:text-gray-200">{s.name}</p>
                                    <p className="text-xs text-gray-400">{s.email}</p>
                                </div>
                                {s.created_at && (
                                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                                        {new Date(s.created_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
