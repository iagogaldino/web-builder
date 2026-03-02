import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { grapesjs } from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import blocksBasic from 'grapesjs-blocks-basic';
import pluginForms from 'grapesjs-plugin-forms';
import pluginNavbar from 'grapesjs-navbar';
import pluginCountdown from 'grapesjs-component-countdown';
import layoutBlocksPlugin from './app/grapesjs-layout-blocks';
import shoelaceBlocksPlugin from './app/grapesjs-shoelace-blocks';
import exportAngularPlugin from './app/grapesjs-export-angular';
import angularEventsPlugin from './app/grapesjs-angular-events';

// ngx-grapesjs and GrapesJS expect these on the global object
const LAYOUT_PLUGIN_ID = 'grapesjs-blocks-layout';
const SHOELACE_BLOCKS_PLUGIN_ID = 'grapesjs-blocks-shoelace';
const EXPORT_ANGULAR_PLUGIN_ID = 'grapesjs-export-angular';
const ANGULAR_EVENTS_PLUGIN_ID = 'grapesjs-angular-events';
const win = window as unknown as Window & {
  grapesjs: typeof grapesjs;
  'grapesjs-preset-webpage': typeof presetWebpage;
  'gjs-blocks-basic': typeof blocksBasic;
  'grapesjs-plugin-forms': typeof pluginForms;
  'grapesjs-navbar': typeof pluginNavbar;
  'grapesjs-component-countdown': typeof pluginCountdown;
  [LAYOUT_PLUGIN_ID]: typeof layoutBlocksPlugin;
  [SHOELACE_BLOCKS_PLUGIN_ID]: typeof shoelaceBlocksPlugin;
  [EXPORT_ANGULAR_PLUGIN_ID]: typeof exportAngularPlugin;
  [ANGULAR_EVENTS_PLUGIN_ID]: typeof angularEventsPlugin;
};
win.grapesjs = grapesjs;
win['grapesjs-preset-webpage'] = presetWebpage;
win['gjs-blocks-basic'] = blocksBasic;
win['grapesjs-plugin-forms'] = pluginForms;
win['grapesjs-navbar'] = pluginNavbar;
win['grapesjs-component-countdown'] = pluginCountdown;
win[LAYOUT_PLUGIN_ID] = layoutBlocksPlugin;
win[SHOELACE_BLOCKS_PLUGIN_ID] = shoelaceBlocksPlugin;
win[EXPORT_ANGULAR_PLUGIN_ID] = exportAngularPlugin;
win[ANGULAR_EVENTS_PLUGIN_ID] = angularEventsPlugin;

// Shoelace é carregado apenas dentro do iframe do canvas (grapesjs-shoelace-blocks).
// Não carregar no host evita NotAllowedError (adoptedStyleSheets entre documentos).
bootstrapApplication(App, appConfig).catch((err: unknown) => console.error(err));
