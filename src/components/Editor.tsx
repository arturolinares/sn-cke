import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { debounce } from 'lodash';

export enum HtmlElementId {
  snComponent = 'sn-component',
  textarea = 'textarea',
}

export enum HtmlClassName {
  snComponent = 'sn-component',
  textarea = 'sk-input contrast textarea',
}

export interface EditorInterface {
  text: string;
}

const initialState = {
  text: '',
};

let keyMap = new Map();

const defaultEditorConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      'fontSize',
      'highlight',
      'fontFamily',
      'codeBlock',
      'code',
      'removeFormat',
      '|',
      'todoList',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      'horizontalLine',
      '|',
      'imageUpload',
      'toggleImageCaption',
      'imageTextAlternative',
      '|',
      'blockQuote',
      'insertTable',
      'htmlEmbed',
      'mediaEmbed',
      'undo',
      'redo',
    ],
  },
  language: 'en',
};

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;

  constructor(props: EditorInterface) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = () => {
    this.configureEditorKit();
  };

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded */
      setEditorRawText: (text: string) => {
        this.setState({
          text,
        });
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'html',
      supportsFilesafe: false,
    });
  };

  saveText = (text: string) => {
    this.saveNote(text);
    this.setState({
      text,
    });
  };

  saveNote = (text: string) => {
    /** This will work in an SN context, but breaks the standalone editor,
     * so we need to catch the error
     */
    try {
      this.editorKit.onEditorValueChanged(text);
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };

  onBlur = (e: React.FocusEvent) => {};

  onFocus = (e: React.FocusEvent) => {};

  onKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.set(e.key, true);
    // Do nothing if 'Control' and 's' are pressed
    if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
    }
  };

  onKeyUp = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.delete(e.key);
  };

  handleInputChange = debounce((event: any, editor: any) => {
    this.saveText(editor.getData());
  }, 500);

  render() {
    const { text } = this.state;
    return (
      <CKEditor
        editor={editor}
        config={defaultEditorConfig}
        data={text}
        onChange={this.handleInputChange}
      />
    );
  }
}
