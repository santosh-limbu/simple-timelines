import TimelinePlugin from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";

// Extends PluginSettingTab to create a custom settings tab for the TimelinePlugin.
export class TimelineSettings extends PluginSettingTab {
    plugin: TimelinePlugin;

    // Constructor for the settings tab.
    constructor(app: App, plugin: TimelinePlugin) {
        super(app, plugin);
        this.plugin = plugin; // Store a reference to the plugin instance.
    }

    // Method to display the settings UI.
    display(): void {
        // Clears the container element before rendering new settings.
        this.containerEl.empty();
        
        // Creates a new setting field in the settings tab.
        new Setting(this.containerEl)
        .setName("Search Tag") // Sets the name of the setting.
        .setDesc("How Timelines are identified.") // Sets the description.
        .addText((text) => // Adds a text input field.
          text
            .setPlaceholder("#timeline") // Sets placeholder text.
            .setValue(this.plugin.settings.searchTag) // Sets the default or current value.
            .onChange(async (value) => { // Event listener for value changes.
                this.plugin.settings.searchTag = value; // Updates the plugin's settings.
                await this.plugin.saveSettings(); // Saves the updated settings.
              })
        );
    }
}
