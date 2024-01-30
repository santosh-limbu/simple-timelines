import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';

export const TIMELINE_VIEW = 'timeline-view';

export class TimelineView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
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
    const taggedFiles = await this.fetchTaggedFiles('timeline');
  
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

  createListItem(container: HTMLElement, file: TFile) {
     // Create a new list item
  const listItem = container.createEl('li');

  // Add the file name as the list item's text
  listItem.createEl('span', { text: file.basename });

  // Optionally, add a link to open the file when clicked
  listItem.addEventListener('click', () => {
    this.app.workspace.openLinkText(file.path, file.path, 'tab');
  });
  }

  async onClose() {
    // Nothing to clean up.
  }
}
