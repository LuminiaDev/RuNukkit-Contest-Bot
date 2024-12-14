import { BotCommand } from "../command";
import { FALLBACK_LANGUAGE } from "../../api/constants";
import { 
    SlashCommandBuilder, 
    ChannelType, 
    TextChannel, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits
} from "discord.js";
import { Locale, Localizer } from "../../locale";

export default class MakeContestPostCommand extends BotCommand {
    
    public getBuilder(locale: Locale): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('makecontestpost')
            .setDescription(locale.t(FALLBACK_LANGUAGE, 'commands-makecontestpost-description'))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addChannelOption(option => 
                option
                    .setName('channel')
                    .setDescription('Channel')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            ) as SlashCommandBuilder;
    }
    
    public async execute(interaction: ChatInputCommandInteraction, locale: Localizer): Promise<void> {
        const channel = interaction.options.getChannel('channel') as TextChannel;
        
        if (!channel) {
            return;
        }

        try {
            const message = await channel.send({ content: locale.t('commands-makecontestpost-post-message') });
            if (message) {
                await interaction.reply({ 
                    content: locale.t('commands-makecontestpost-post-created', {
                        url: message.url
                    }), 
                    ephemeral: true 
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: locale.t('commands-makecontestpost-failed'), ephemeral: true });
        }
    }
}