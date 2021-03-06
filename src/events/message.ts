import { Message, Client, MessageEmbed } from 'discord.js'
import { loadConfig } from '../utils'
const config = loadConfig()

export = (client: Client, message: Message): Promise<any> => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return

  const arg = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = arg.shift().toLowerCase()
  const cmd = client.commands.get(command)
  const args = arg.join(' ')
  if (!cmd) return

  const embed = new MessageEmbed()
  if (!message.guild.me.hasPermission(cmd.permsNeeded)) {
    embed
      .setAuthor(message.guild.member(message.author).displayName, message.author.avatarURL({ dynamic: true }))
      .setDescription(`I lack \`${cmd.permsNeeded}\` permissions`)
      .setColor('RED')
    return message.reply(embed)
  } else if (!message.member.hasPermission(cmd.permsNeeded)) {
    embed
      .setAuthor(message.guild.member(message.author).displayName, message.author.avatarURL({ dynamic: true }))
      .setDescription(`You do not have \`${cmd.permsNeeded}\` permissions`)
      .setColor('RED')
    return message.reply(embed)
  }

  if (!cmd.isOwnerOnly) {
    return cmd.run(message, args)
  } else if (cmd.isOwnerOnly && message.author.id === config.owner) {
    return cmd.run(message, args)
  } else {
    return
  }
}
