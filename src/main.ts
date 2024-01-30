import { Plugin, } from 'obsidian';
import {TimelineSettings } from 'src/settings';
import { TIMELINE_VIEW, TimelineView } from 'src/view';

interface TimelinePluginSettings {
  searchTag: string;
}

const DEFAULT_SETTINGS: Partial<TimelinePluginSettings> = {
  searchTag: "#timeline"
}

export default class TimelinePlugin extends Plugin {
  settings: TimelinePluginSettings;

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async loadSettings() {
    this.settings = await Object.assign({},
    DEFAULT_SETTINGS,  
    await this.loadData());
  }

	async onload() {
    await this.loadSettings();
    // Configure resources needed by the plugin.
    this.addSettingTab(new TimelineSettings(this.app, this));

    this.registerView(TIMELINE_VIEW, (leaf) => new TimelineView(leaf))

    this.addRibbonIcon("list-tree", "Timeline View", () => {
      this.openView();
    })

    this.addCommand({
      id: "createTimeline",
      name: "New Timeline Event"

    })
	}
  
  openView() {
    this.app.workspace.detachLeavesOfType(TIMELINE_VIEW)
    const leaf = this.app.workspace.getRightLeaf(false)

    leaf.setViewState({
        type: TIMELINE_VIEW,
    });

    this.app.workspace.revealLeaf(leaf);


  }
  
	async onunload() {
	// Release any resources configured by the plugin.
	}
  }