import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Locale, Localizer } from "../locale";

export abstract class BotCommand {
    
    /**
     * Getting a command builder
     * 
     * @returns SlashCommandBuilder
     */
    public abstract getBuilder(locale: Locale): SlashCommandBuilder;

    /**
     * Executed when the user uses the command
     * 
     * @param interaction CommandInteraction
     * @param locale Localizer
     * @returns Promise<void>
     */
    public abstract execute(interaction: ChatInputCommandInteraction, locale: Localizer): Promise<void>;

    /**
     * Execute the command asynchronously
     * 
     * @param interaction CommandInteraction
     * @param locale Localizer
     * @returns Promise<void>
     */
    public async executeAsync(interaction: ChatInputCommandInteraction, locale: Localizer): Promise<void> {
        this.execute(interaction, locale).catch(error => {
            console.error(error);
        });
    }

    /**
     * Checks if the command is asynchronous
     * 
     * @returns true if asynchronous, otherwise false
     */
    public isAsync(): boolean {
        return this instanceof AsyncCommand
    }
}

/**
 * This class is used to specify that the command should be asynchronous
 */
export abstract class AsyncCommand extends BotCommand {

}