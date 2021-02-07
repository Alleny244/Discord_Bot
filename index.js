require('dotenv').config();
const { default: axios } = require('axios');
const ytsr = require('ytsr');
const Discord=require('discord.js');
const PREFIX="!"
const Client=new Discord.Client({
  partials:['MESSAGE','REACTION']
});


Client.on('ready', () => {
    console.log(`Logged in as ${Client.user.tag}!`);
  });

  Client.on('message', async msg => {
    if(!msg.author.bot){
      if(msg.content.startsWith(PREFIX)){
        var [command,...tag]=msg.content.trim().substring(PREFIX.length).split(/\s+/);
       
      if(command==="kick"){
        if(!msg.member.hasPermission('KICK_MEMBERS')){
          return msg.channel.send("You do not have permissions to kick that user")
        }
        if(tag.length==0){
           return msg.channel.reply("Please mention the id of the User")
        }
        const member=msg.guild.members.cache.get(tag[0])
        if(member){
         member.kick().then((member)=>msg.channel.reply(`${member} kicked out of the server`))
         .catch(err=>msg.channel.send("You don't have the required permissions to kick that user"))
        }
        else{
         msg.channel.send("No Such Person in this server")
        }
       
      }
      else if(command==="ban"){
        if(!msg.member.hasPermission('KICK_MEMBERS')){
          return msg.channel.send("You do not have permissions to kick that user")
        }
        if(tag.length==0){
           return msg.channel.reply("Please mention the id of the User")
        }
        msg.guild.members.ban(tag[0]).catch(err=>msg.channel.send("No such user in channel"))
      }
      else if(command==="mk-moderator"){
        msg.member.roles.add('806061489085349890')
        msg.reply("Role Assigned!!!")
      }
      else if(command==="mk-secretary"){
        msg.member.roles.add('807295162669727814')
        msg.reply("Role Assigned!!!")
      }
      else if(command==="joke"){
        let getJoke=async()=>{
          let response=await axios.get("https://v2.jokeapi.dev/joke/Any")
          let jokes=response.data;
          return jokes;

        }
       var joke=await getJoke()
       msg.channel.send("Here's your joke")
       msg.channel.send(`${joke.setup}\n\n${joke.delivery}`)
      }
      else if(command==="weather"){
        if(tag.length==0){
          return msg.channel.send("Please mention the name of the city")
       }
        let getWeather=async()=>{
          let response=await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${tag[0]}&units=metric&appid=${process.env.Weather_Token}`)
          let weathers=response.data;
          return (weathers)

        }
       var weather=await getWeather().catch(err=>console.error(err))
       msg.channel.send(
      `Climate : ${weather.weather[0].main}
       Maximum Temperature : ${weather.main.temp_max} Celsius
       Minimum Temperature : ${weather.main.temp_min} Celsius
       Pressure : ${weather.main.pressure} 	hPa
       Wind Speed : ${weather.wind.speed} meter/sec
       Humidity : ${weather.main.humidity}%`)   
      }

      else if(command==="youtube"){
        if(tag.length==0){
          return msg.channel.send("Please mention the name of the video")
       }
       var key=tag.join(" ")

        const filters1 = await ytsr.getFilters(key);
        const filter1 = filters1.get('Type').get('Video');
        const filters2 = await ytsr.getFilters(filter1.url);
        const filter2 = filters2.get('Features').get('HD');
        const options = {
          pages: 1,
        }
        const searchResults = await ytsr(filter2.url, options);
        var title=searchResults.items[0].title
        var url =searchResults.items[0].url
        var describe=searchResults.items[0].description
        var views=searchResults.items[0].views
        var duration=searchResults.items[0].duration
        var thumbnail=searchResults.items[0].bestThumbnail

        const exampleEmbed = new Discord.MessageEmbed()
	.setTitle(title)
	.setURL(url)
  .addField('Views', views, true)
  .addField(' Duration', duration, true)
  .setImage(thumbnail.url)
  .setDescription(describe)

  msg.channel.send(exampleEmbed);

      }
    }
      else{
        msg.react('😍')
        msg.channel.send(`Hi There I am a bot. My name is ${Client.user}`)
      }
     
    
  }
   /*else if (msg.content === '!make-mod') {
      msg.member.roles.add("806061489085349890")
    }
   else if (msg.content === '!rm-mod') {
      msg.member.roles.remove("806061489085349890")
    }
    else if (msg.content === '!music') {
      Audio
    }
    else if(msg.content === 'hi'){
     var author= msg.author.lastMessage.toString();
     msg.reply('Hello ' +author);
     //msg.channel.send("not tagged")

    }*/
  });

Client.login(process.env.Token)  