import { BotCommand } from "../command";
import { FALLBACK_LANGUAGE } from "../../api/constants";
import { 
    SlashCommandBuilder, 
    ChannelType, 
    ChatInputCommandInteraction, 
    ForumChannel, 
    AttachmentBuilder, 
    PermissionFlagsBits 
} from "discord.js";
import { Locale, Localizer } from "../../locale";

export default class MakePluginPostCommand extends BotCommand {
    
    public getBuilder(locale: Locale): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('makepluginpost')
            .setDescription(locale.t(FALLBACK_LANGUAGE, 'commands-makepluginpost-description'))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addChannelOption(option => 
                option
                    .setName('channel')
                    .setDescription('Channel')
                    .addChannelTypes(ChannelType.GuildForum)
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('title')
                    .setDescription('Title')
                    .setRequired(true)
            )
            .addAttachmentOption(option =>
                option
                    .setName('image')
                    .setDescription('Plugin screenshot')
                    .setRequired(false)
            )
            .addAttachmentOption(option =>
                option
                    .setName('file')
                    .setDescription('Plugin source')
                    .setRequired(false)
            ) as SlashCommandBuilder;
    }
    
    public async execute(interaction: ChatInputCommandInteraction, locale: Localizer): Promise<void> {
        const forum = interaction.options.getChannel('channel') as ForumChannel;
        const title = interaction.options.getString('title');
        const image = interaction.options.getAttachment('image');
        const file = interaction.options.getAttachment('file');
        
        if (!forum || !title) {
            return;
        }

        try {
            const thread = await forum.threads.create({
                name: title,
                message: {
                    content: locale.t('commands-makepluginpost-format-post-message')
                }
            });
            
            if (!thread) {
                return;
            }

            const attachments = [];
            if (image) {
                attachments.push(new AttachmentBuilder(image.url, { name: image.name }));
            }
            if (file) {
                attachments.push(new AttachmentBuilder(file.url, { name: file.name }));
            }
            
            await thread.send({
                content: locale.t('commands-makepluginpost-plugin-post-message'),
                files: attachments,
            });
            await thread.setLocked(true);

            await interaction.reply({
                content: locale.t('commands-makepluginpost-post-created', {
                    title: title,
                    url: thread.url
                }),
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: locale.t('commands-makecontestpost-failed'), ephemeral: true });
        }
    }
}