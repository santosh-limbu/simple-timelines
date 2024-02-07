import { ItemView, WorkspaceLeaf, TFile} from 'obsidian';
import TimelinePlugin from './main';

export const TIMELINE_VIEW = 'timeline-view';

export class TimelineView extends ItemView {
  plugin: TimelinePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: TimelinePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return TIMELINE_VIEW;
  }

  getDisplayText() {
    return 'Timeline View';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    
    const listContainer = container.createEl('ul');
  
    // Fetch all files with the "#timeline" tag
    const taggedFiles = await this.fetchTaggedFiles(this.plugin.settings.searchTag);
  
    // Create list items for each tagged file
    taggedFiles.forEach((file: TFile) => {
      this.createListItem(listContainer, file);
    });
  }
  
  async fetchTaggedFiles(tag: string): Promise<TFile[]> {
    const files = this.app.vault.getFiles();
    const taggedFiles: TFile[] = [];
  
    for (const file of files) {
      if (file instanceof TFile) {
        const content = await this.app.vault.read(file);
        const tagRegex = new RegExp(`#${tag}\\b`, 'g');
        if (tagRegex.test(content)) {
          taggedFiles.push(file);
        }
      }
    }
  
    return taggedFiles;
  }

  // Create a list item for each tagged file.
  createListItem(container: HTMLElement, file: TFile) {
    const listItem = container.createEl('li'); // Create a new list item.

    listItem.createEl('span', { text: file.basename }); // Add the file name as the list item's text.

    // Add a click event listener to open the file in the existing pane or a new pane.
    listItem.addEventListener('click', () => {
      const existingView = this.app.workspace.getLeavesOfType('markdown').find(leaf => leaf.view.getState().file === file.path);
      if (existingView) {
        this.app.workspace.setActiveLeaf(existingView);
        // Optionally, if you need to focus the content of the leaf, you can do so here.
      } else {
        this.app.workspace.openLinkText(file.path, '', true);
      }
    });
  }

  async onClose() {
    // Nothing to clean up.
  }
}