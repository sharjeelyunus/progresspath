import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import EditorMenuBar from './EditorMenubar';

const extensions = [
  StarterKit,
  BulletList,
  ListItem,
  Document,
  Paragraph,
  Text,
];

const content = '<p>Hello World!</p>';

const Tiptap = ({ height }: { height: string } = { height: '300px' }) => {
  const editor = useEditor({
    extensions,
    content,
    autofocus: true,
    editable: true,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose border h-[300px] lg:prose-lg xl:prose-2xl mt-2 placeholder:text-black overflow-y-scroll`,
        id: 'no_scroll',
      },
    },
  });

  return (
    <>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} className='h-[300px]' />
    </>
  );
};

export default Tiptap;
