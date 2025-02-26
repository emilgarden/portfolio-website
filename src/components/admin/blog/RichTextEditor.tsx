'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TextAlign from '@tiptap/extension-text-align'
import { common, createLowlight } from 'lowlight'
import { useState, useCallback, useRef } from 'react'
import supabase from '@/supabaseClient'
import {
  Bold, Italic, Underline as UnderlineIcon, Code, List, ListOrdered, 
  Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3, Quote, Undo, Redo, X
} from 'lucide-react'

// Initialiser lowlight med vanlige språk
const lowlight = createLowlight(common)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Skriv innholdet her...' }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return
    
    try {
      setUploading(true)
      
      // Generer et unikt filnavn
      const fileExt = file.name.split('.').pop() || 'png'
      const timestamp = new Date().getTime()
      const randomString = Math.random().toString(36).substring(2, 10)
      const fileName = `blog_image_${timestamp}_${randomString}.${fileExt}`
      
      // Last opp til Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(`images/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        })
      
      if (error) throw error
      
      // Hent offentlig URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path)
      
      // Sett inn bildet i editoren
      editor.chain().focus().setImage({ src: urlData.publicUrl }).run()
    } catch (error) {
      console.error('Feil ved opplasting av bilde:', error)
      alert('Kunne ikke laste opp bildet. Prøv igjen senere.')
    } finally {
      setUploading(false)
    }
  }, [editor])

  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const setLink = useCallback(() => {
    if (!editor) return
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    
    // Hvis URL ikke starter med http:// eller https://, legg til https://
    const url = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setLinkUrl('')
    setShowLinkMenu(false)
  }, [editor, linkUrl])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="flex flex-wrap items-center bg-gray-50 border-b border-gray-300 p-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Fet"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Kursiv"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Understreket"
        >
          <UnderlineIcon className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="Overskrift 1"
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Overskrift 2"
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="Overskrift 3"
        >
          <Heading3 className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Punktliste"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Nummerert liste"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          title="Kodeblokk"
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Sitat"
        >
          <Quote className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        
        <button
          type="button"
          onClick={() => {
            setShowLinkMenu(true)
            if (linkInputRef.current) {
              setTimeout(() => {
                linkInputRef.current?.focus()
              }, 0)
            }
          }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Legg til lenke"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleImageButtonClick}
          className={`p-2 rounded hover:bg-gray-200 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
          title="Last opp bilde"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          title="Venstrejustert"
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          title="Sentrert"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          title="Høyrejustert"
        >
          <AlignRight className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
          disabled={!editor.can().undo()}
          title="Angre"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
          disabled={!editor.can().redo()}
          title="Gjenta"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
      
      {showLinkMenu && (
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center">
          <input
            ref={linkInputRef}
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Skriv inn URL..."
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            onKeyDown={(e) => e.key === 'Enter' && setLink()}
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Legg til
          </button>
          <button
            type="button"
            onClick={() => setShowLinkMenu(false)}
            className="p-2 ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
      
      {editor.isActive('link') && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-white shadow-lg rounded-md p-2 flex items-center">
            <input
              type="text"
              defaultValue={editor.getAttributes('link').href}
              className="p-1 border border-gray-300 rounded-md mr-2 w-60"
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setLink()}
            />
            <button
              type="button"
              onClick={setLink}
              className="p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Oppdater
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1 ml-1 text-red-600 hover:text-red-800"
              title="Fjern lenke"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </BubbleMenu>
      )}
    </div>
  )
} 