import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import TimelinePlugin from './main';

// Define a constant for the view type identifier.
export const TIMELINE_VIEW = 'timeline-view';

// Extend ItemView to create a custom view for the timeline.
export class TimelineView extends ItemView {
  plugin: TimelinePlugin;
  // Constructor to initialize the view.
  constructor(leaf: WorkspaceLeaf, plugin: TimelinePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  // Returns the view type identifier.
  getViewType() {
    return TIMELINE_VIEW;
  }

  // Returns the display name of the view.
  getDisplayText() {
    return 'Timeline View';
  }

  // Called when the view is opened.
  async onOpen() {
    const container = this.containerEl.children[1]; // Reference to the view container.
    container.empty(); // Clear any existing content.
    
    const listContainer = container.createEl('ul'); // Create a list container.
  
    // Fetch all files with the "#timeline" tag.
    const taggedFiles = await this.fetchTaggedFiles();
  
    // Create list items for each tagged file.
    taggedFiles.forEach((file: TFile) => {
      this.createListItem(listContainer, file);
    });
  }
  
  // Fetches files from the vault that contain a specific tag.
  async fetchTaggedFiles(): Promise<TFile[]> {
    const tag = this.plugin.settings.searchTag;
    const files = this.app.vault.getFiles(); // Get all files in the vault.
    const taggedFiles: TFile[] = [];
  
    // Loop through each file to check for the tag.
    for (const file of files) {
      if (file instanceof TFile) {
        const content = await this.app.vault.read(file); // Read the file content.
        const tagRegex = new RegExp(`#${tag}\\b`, 'g'); // Regex to find the tag.
        if (tagRegex.test(content)) {
          taggedFiles.push(file); // Add file to the list if the tag is found.
        }
      }
    }
  
    return taggedFiles;
  }

  // Create a list item for each tagged file.
  createListItem(container: HTMLElement, file: TFile) {
    const listItem = container.createEl('li'); // Create a new list item.

    listItem.createEl('span', { text: file.basename }); // Add the file name as the list item's text.

    // Add a click event listener to open the file.
    listItem.addEventListener('click', () => {
      this.app.workspace.openLinkText(file.path, file.path, 'tab');
    });
  }

  // Called when the view is closed.
  async onClose() {
    // Optional: Clean up resources or listeners.
  }
}
