require("dotenv").config();
const { default: axios } = require("axios");
const ytsr = require("ytsr");
const Discord = require("discord.js");
const PREFIX = "!";
const Client = new Discord.Client({
  partials: ["MESSAGE", "REACTION"],
});
let url = "";
let name = "";

Client.on("ready", () => {
  console.log(`Logged in as ${Client.user.tag}!`);
  url = Client.user.avatarURL();
  name = Client.user.username;
});

Client.on("guildCreate", (guild) => {
  console.log(`Joined new guild: ${guild.name}`);
  let channelID;
  let channels = guild.channels.cache;
  channelLoop: for (let key in channels) {
    let c = channels[key];
    if (c[1].type === "text") {
      channelID = c[0];
      break channelLoop;
    }
  }

  let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
  channel.send({
    embed: {
      color: 3066993,
      author: {
        name: name,
        icon_url: url,
      },
      thumbnail: {
        url: url,
      },
      title: "\n \nThanks for adding me to your server! :blush:",
      description:
        "\n \nThis is an interactive Discord Bot \n \n👇 To get started type 👇\n\t",
      fields: [
        {
          name: "!help",
          value: "List the functionalities of the bot",
          inline: false,
        },
      ],
      timestamp: new Date(),
      footer: {
        icon_url: url,
        text: "©",
      },
    },
  });
});

Client.on("guildMemberAdd", (user) => {
  const channel = user.guild.channels.cache.get(user.guild.systemChannelID);
  channel.send({
    embed: {
      color: 3066993,
      author: {
        name: name,
        icon_url: url,
      },
      thumbnail: {
        url: url,
      },
      title: `\n \n  Hey  ${user.user.username} , Welcome to ${user.guild.name} :blush:\n`,
      description: `\n \nMy Name is ${Client.user.tag}\n \n👇 To get started type 👇\n\t`,
      fields: [
        {
          name: "!help",
          value: "List the functionalities of the bot",
          inline: false,
        },
        {
          name: "!google searchQuery",
          value:
            "For Quick Google Search\t (example ==>  !google Lost TV Series)",
          inline: false,
        },
        {
          name: "!weather CityName",
          value:
            "For Knowing Current weather of your city\t(example ==>  !weather kochi)",
          inline: false,
        },
        {
          name: "!youtube Song Name",
          value: "For youtube search\t(example ==> !youtube Alone)",
          inline: false,
        },
        { name: "!joke", value: "For Cracking a Joke", inline: false },
      ],
      timestamp: new Date(),
      footer: {
        icon_url: url,
        text: "©",
      },
    },
  });
});

Client.on("message", async (msg) => {
  if (!msg.author.bot) {
    if (msg.content.startsWith(PREFIX)) {
      var [command, ...tag] = msg.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

      if (command === "kick") {
        if (!msg.member.hasPermission("KICK_MEMBERS")) {
          return msg.channel.send(
            "You do not have permissions to kick that user"
          );
        }
        if (tag.length == 0) {
          return msg.channel.reply("Please mention the id of the User");
        }
        const member = msg.guild.members.cache.get(tag[0]);
        if (member) {
          member
            .kick()
            .then((member) =>
              msg.channel.reply(`${member} kicked out of the server`)
            )
            .catch((err) =>
              msg.channel.send(
                "You don't have the required permissions to kick that user"
              )
            );
        } else {
          msg.channel.send("No Such Person in this server");
        }
      } else if (command === "ban") {
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
          return msg.channel.send(
            "You do not have permissions to ban that user"
          );
        }
        if (tag.length == 0) {
          return msg.channel.reply("Please mention the id of the User");
        }
        msg.guild.members
          .ban(tag[0])
          .catch((err) => msg.channel.send("No such user in channel"));
      } else if (command === "mk-moderator") {
        msg.member.roles.add("806061489085349890");
        msg.reply("Role Assigned!!!");
      } else if (command === "mk-secretary") {
        msg.member.roles.add("807295162669727814");
        msg.reply("Role Assigned!!!");
      } else if (command === "joke") {
        let getJoke = async () => {
          let response = await axios.get("https://v2.jokeapi.dev/joke/Any");
          let jokes = response.data;
          return jokes;
        };
        var joke = await getJoke();
        msg.channel.send("Here's your joke");
        msg.channel.send(`${joke.setup}\n\n${joke.delivery}`);
      } else if (command === "weather") {
        if (tag.length == 0) {
          return msg.channel.send("Please mention the name of the city");
        }
        let getWeather = async () => {
          let response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${tag[0]}&units=metric&appid=${process.env.Weather_Token}`
          );
          let weathers = response.data;
          return weathers;
        };
        var weather = await getWeather().catch((err) => console.error(err));
        msg.channel.send(
          `Climate : ${weather.weather[0].main}
       Maximum Temperature : ${weather.main.temp_max} Celsius
       Minimum Temperature : ${weather.main.temp_min} Celsius
       Pressure : ${weather.main.pressure} 	hPa
       Wind Speed : ${weather.wind.speed} meter/sec
       Humidity : ${weather.main.humidity}%`
        );
      } else if (command === "youtube") {
        if (tag.length == 0) {
          return msg.channel.send("Please mention the name of the video");
        }
        var key = tag.join(" ");

        const filters1 = await ytsr.getFilters(key);
        const filter1 = filters1.get("Type").get("Video");
        const filters2 = await ytsr.getFilters(filter1.url);
        const filter2 = filters2.get("Features").get("HD");
        const options = {
          pages: 1,
        };
        const searchResults = await ytsr(filter2.url, options);
        var title = searchResults.items[0].title;
        var url = searchResults.items[0].url;
        var describe = searchResults.items[0].description;
        var views = searchResults.items[0].views;
        var duration = searchResults.items[0].duration;
        var thumbnail = searchResults.items[0].bestThumbnail;

        const exampleEmbed = new Discord.MessageEmbed()
          .setTitle(title)
          .setURL(url)
          .addField("Views", views, true)
          .addField(" Duration", duration, true)
          .setImage(thumbnail.url)
          .setDescription(describe);

        msg.channel.send(exampleEmbed);
      } else if (command === "google") {
        let searchGoogle = async () => {
          let response = await axios.get(
            `https://customsearch.googleapis.com/customsearch/v1?cx=e5a1ff28c89e774c9&q=${tag}&key=${process.env.GOOGLE_API_KEY}`
          );
          let result = response.data;
          return result;
        };

        var result = await searchGoogle();
        var title = result.items[0].title;
        var snippet = result.items[0].snippet;
        var link = result.items[0].link;
        msg.channel.send("Here's your optimized search result\n\n");
        msg.channel.send(`${title}\n${snippet}\n${link}`);
      } else if (command === "help") {
        msg.channel.send({
          embed: {
            color: 3066993,
            author: {
              name: name,
              icon_url: url,
            },
            thumbnail: {
              url: url,
            },

            title: `\n \nMy Name is ${Client.user.tag}\n \n👇 To get started type 👇\n\t`,
            fields: [
              {
                name: "!help",
                value: "List the functionalities of the bot",
                inline: false,
              },
              {
                name: "!google searchQuery",
                value:
                  "For Quick Google Search\t (example ==>  !google Lost TV Series)",
                inline: false,
              },
              {
                name: "!weather CityName",
                value:
                  "For Knowing Current weather of your city\t(example ==>  !weather kochi)",
                inline: false,
              },
              {
                name: "!youtube Song Name",
                value: "For youtube search\t(example ==> !youtube Alone)",
                inline: false,
              },
              { name: "!joke", value: "For Cracking a Joke", inline: false },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: url,
              text: "©",
            },
          },
        });
      } else {
        msg.react("🥲");
        msg.channel.send(
          "I am not Trained for this command !! Please type \t!help\t for your reference :relaxed:"
        );
      }
    }
  }
});

Client.login(process.env.Token);
