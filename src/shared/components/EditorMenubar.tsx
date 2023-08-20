import React from 'react';
import { Editor } from '@tiptap/react';
import {
  FaBold,
  FaCode,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaStrikethrough,
  FaUnderline,
} from 'react-icons/fa';
import {
  FiAlignLeft,
  FiAlignCenter,
  FiAlignJustify,
  FiAlignRight,
} from 'react-icons/fi';
// import H1 from 'images/icons/editorToolbar/h1.png';
// import H2 from 'images/icons/editorToolbar/h2.png';

const EditorMenuBar = ({ editor }: IEditorProps) => {
  const upload = async (file: File) => {
    console.log('Hello');
    const url = URL.createObjectURL(file);
    console.log(url);

    return Promise.resolve(url);
  };

  if (!editor) {
    return null;
  }

  // Adding anchor link
  const setLink = () => {
    const url = window.prompt('URL');

    if (!url) return;

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Adding image to the editor
  const addImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const command = editor?.chain();

  // list of extensions i am using
  const extentions = [
    {
      icon: <FaBold aria-label='bold' className='w-5 h-5' />,
      title: 'Bold',
      key: 'bold',
      command: () => command?.toggleBold()?.run(),
      disabled: false,
    },
    {
      icon: <FaItalic aria-label='italic' className='w-5 h-5' />,
      title: 'Italic',
      key: 'italic',
      command: () => command?.toggleItalic().run(),
      disabled: false,
    },
    {
      icon: <FaUnderline aria-label='underline' className='w-5 h-5' />,
      title: 'Underline',
      key: 'underline',
      command: () => command?.toggleUnderline().run(),
      disabled: false,
    },
    {
      icon: <FaLink aria-label='link' className='w-5 h-5' />,
      title: 'Link',
      key: 'link',
      command: setLink,
      disabled: false,
    },
    {
      icon: <FaStrikethrough aria-label='strike' className='w-5 h-5' />,
      title: 'Strike',
      key: 'strike',
      command: () => command?.toggleStrike().run(),
      disabled: false,
    },
    {
      icon: <FaListUl aria-label='unordered' className='w-5 h-5' />,
      title: 'UnorderedList',
      key: 'bulletList',
      command: () => command?.toggleBulletList().run(),
      disabled: false,
    },
    {
      icon: <FaListOl aria-label='ordered' className='w-5 h-5 text-xl' />,
      title: 'OrderedList',
      key: 'orderedList',
      command: () => command?.toggleOrderedList().run(),
      disabled: false,
    },
    {
      icon: <FiAlignLeft aria-label='align' className='w-7 h-7' />,
      title: 'LeftAlign',
      key: 'leftAlign',
      command: () => command?.setTextAlign('left').run(),
      disabled: false,
    },
    {
      icon: <FiAlignCenter aria-label='align' className='w-7 h-7' />,
      title: 'CenterAlign',
      key: 'centerAlign',
      command: () => command?.setTextAlign('center').run(),
      disabled: false,
    },
    {
      icon: <FiAlignRight aria-label='align' className='w-7 h-7' />,
      title: 'RightAlign',
      key: 'rightAlign',
      command: () => command?.setTextAlign('right').run(),
      disabled: false,
    },
    {
      icon: <FiAlignJustify aria-label='align' className='w-7 h-7' />,
      title: 'JustifyAlign',
      key: 'justifyAlign',
      command: () => command?.setTextAlign('justify').run(),
      disabled: false,
    },
    // {
    //   icon: <img src={H1} aria-label='heading' className='h-7 w-7' />,
    //   title: 'Heading 1',
    //   key: 'heading1',
    //   command: () => command.toggleHeading({ level: 1 }).run(),
    //   disabled: false,
    // },
    // {
    //   icon: <img src={H2} aria-label='heading' className='h-7 w-7' />,
    //   title: 'Heading 2',
    //   key: 'heading2',
    //   command: () => command.toggleHeading({ level: 2 }).run(),
    //   disabled: false,
    // },
    {
      icon: <FaQuoteLeft aria-label='quote' className='w-5 h-5' />,
      title: 'BlockQuote',
      key: 'blockquote',
      command: () => command.toggleBlockquote().run(),
      disabled: false,
    },
    {
      icon: <FaCode aria-label='code' className='w-5 h-5' />,
      title: 'Code',
      key: 'code',
      command: () => command.toggleCode().run(),
      disabled: false,
    },
  ];

  return (
    <div className='w-full'>
      {extentions.map((extention) => (
        <button
          key={extention.key}
          className={
            extention.key === 'heading1'
              ? editor.isActive('heading', { level: 1 })
                ? 'active'
                : ''
              : extention.key === 'heading2'
              ? editor.isActive('heading', { level: 2 })
                ? 'active'
                : ''
              : extention.key === 'heading3'
              ? editor.isActive('heading', { level: 3 })
                ? 'active'
                : ''
              : extention.key === 'heading4'
              ? editor.isActive('heading', { level: 4 })
                ? 'active'
                : ''
              : extention.key === 'heading5'
              ? editor.isActive('heading', { level: 5 })
                ? 'active'
                : ''
              : extention.key === 'heading6'
              ? editor.isActive('heading', { level: 6 })
                ? 'active'
                : ' '
              : extention.key === 'leftAlign'
              ? editor.isActive({ textAlign: 'left' })
                ? 'active'
                : ''
              : extention.key === 'rightAlign'
              ? editor.isActive({ textAlign: 'right' })
                ? 'active'
                : ''
              : extention.key === 'centerAlign'
              ? editor.isActive({ textAlign: 'center' })
                ? 'active'
                : ''
              : extention.key === 'justifyAlign'
              ? editor.isActive({ textAlign: 'justify' })
                ? 'active'
                : ''
              : editor.isActive(extention.key)
              ? 'active'
              : ''
          }
          disabled={extention.disabled}
          title={extention.title}
          type='button'
          onClick={() => extention.command()}
        >
          {extention.icon}
        </button>
      ))}
    </div>
  );
};

interface IEditorProps {
  editor: Editor | any;
}

export default EditorMenuBar;
