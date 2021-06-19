import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from './CustomEditor';

export enum HtmlElementId {
  snComponent = 'sn-component',
  textarea = 'textarea',
}

export enum HtmlClassName {
  snComponent = 'sn-component',
  textarea = 'sk-input contrast textarea',
}

export interface EditorInterface {
  // printUrl: boolean;
  html: string;
}

const initialState = {
  // printUrl: false,
  html: '',
};

let keyMap = new Map();

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;

  constructor(props: EditorInterface) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded */
      setEditorRawText: (html: string) => {
        this.setState({
          ...initialState,
          html,
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

  saveText = (html: string) => {
    this.saveNote(html);
    this.setState({
      html,
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

  render() {
    const { html } = this.state;
    return (
      <CKEditor
        editor={CustomEditor}
        data={html}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          this.saveText(data);
        }}
      />
    );
  }
}
