import { EditorComponent } from './pages/editor/editor.component';

export const routes = [
  { path: '', component: EditorComponent },
  { path: '**', redirectTo: '' }
];
