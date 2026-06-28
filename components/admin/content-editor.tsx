"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";

{
  /* Extend Image to support custom class attribute for CSS styling */
}
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

import { useCallback, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  uploadImage,
  validateImageFile,
  type UploadProgress,
} from "@/lib/storage";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Upload,
  Loader2,
} from "lucide-react";

interface ContentEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function ContentEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: ContentEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-orange underline",
        },
      }),
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[400px] focus:outline-none px-4 py-3 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-normal",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(
    (url: string) => {
      if (!editor || !url) return;
      {
        /* Use specific class to differentiate from standard images */
      }
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          class: "content-image",
        } as { src: string; class: string })
        .run();
      setImageDialogOpen(false);
      setImageUrl("");
      setUploadError(null);
    },
    [editor],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setUploadError(null);

      const validationError = validateImageFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const { promise } = uploadImage(
          file,
          "content",
          (progress: UploadProgress) => {
            setUploadProgress(progress.progress);
          },
        );

        const result = await promise;
        insertImage(result.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [insertImage],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      e.target.value = "";
    },
    [handleFileUpload],
  );

  const openImageDialog = useCallback(() => {
    setImageDialogOpen(true);
    setImageUrl("");
    setUploadError(null);
  }, []);

  if (!editor) {
    return (
      <div className="min-h-[400px] rounded-lg border bg-muted/20 animate-pulse" />
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={openImageDialog} title="Add Image">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />

              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
                  isUploading
                    ? "pointer-events-none opacity-50"
                    : "hover:border-muted-foreground/50",
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                    <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-center">
                      Click to select an image
                      <br />
                      <span className="text-xs text-muted-foreground">
                        JPEG, PNG, GIF, WebP up to 10MB
                      </span>
                    </p>
                  </>
                )}
              </div>

              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      insertImage(imageUrl);
                    }
                  }}
                />
                <Button
                  onClick={() => insertImage(imageUrl)}
                  disabled={!imageUrl.trim()}
                >
                  Add
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  isActive,
  disabled,
  title,
  size = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  size?: "default" | "sm";
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "sm" : "icon"}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        size === "sm" && "h-6 w-6 p-0",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </Button>
  );
}

function Separator() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}
