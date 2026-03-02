import { Component } from '@angular/core';
import { NgxWebpageEditor } from 'ngx-grapesjs';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgxWebpageEditor],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  protected readonly extraPlugins = [
    'grapesjs-plugin-forms',
    'grapesjs-navbar',
    'grapesjs-component-countdown',
    'grapesjs-blocks-layout',
    'grapesjs-blocks-shoelace',
    'grapesjs-angular-events',
    'grapesjs-export-angular'
  ];
}
