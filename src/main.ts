import { Plugin, } from 'obsidian';
import { TimelineSettings } from 'src/settings';
import { TIMELINE_VIEW, TimelineView } from 'src/view';

// Interface defining the structure of the plugin's settings.
interface TimelinePluginSettings {
  searchTag: string;
}

// Default settings for the plugin.
const DEFAULT_SETTINGS: Partial<TimelinePluginSettings> = {
  searchTag: "#timeline"
}

export default class TimelinePlugin extends Plugin {
  settings: TimelinePluginSettings;

  // Function to save the current settings to the Obsidian data store.
  async saveSettings() {
    await this.saveData(this.settings);
  }

  // Function to load settings from the Obsidian data store.
  async loadSettings() {
    this.settings = await Object.assign({},
    DEFAULT_SETTINGS,  
    await this.loadData());
  }

  // This is called when the plugin is loaded.
	async onload() {
    await this.loadSettings(); // Load settings at startup.
    
    // Add a settings tab for this plugin in Obsidian settings.
    this.addSettingTab(new TimelineSettings(this.app, this));

    // Register a new view type for the plugin.
    this.registerView(TIMELINE_VIEW, (leaf) => new TimelineView(leaf, this))

    // Add a ribbon icon to Obsidian's UI for quick access.
    this.addRibbonIcon("list-tree", "Timeline View", () => {
      this.openView();
    })

    // Register a command that can be invoked by users.
    this.addCommand({
      id: "createTimeline",
      name: "New Timeline Event"
    })
	}
  
  // Function to open and display the timeline view.
  openView() {
    // Detach any existing views of this type.
    this.app.workspace.detachLeavesOfType(TIMELINE_VIEW)
    // Get a leaf (panel) on the right side of the workspace.
    const leaf = this.app.workspace.getRightLeaf(false)

    // Set the view of the leaf to our custom view.
    leaf.setViewState({
        type: TIMELINE_VIEW,
    });

    // Reveal the leaf in the workspace.
    this.app.workspace.revealLeaf(leaf);
  }
  
  // Called when the plugin is unloaded.
	async onunload() {
	// Good place to release resources or clean up.
	}
}
