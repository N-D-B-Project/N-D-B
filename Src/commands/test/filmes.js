const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require("discord.js")

module.exports = class FilmesCommand extends BaseCommand {
  constructor() {
    super('recomende', 'Recomende-Filmes', []);
  }

  async run(client, message, args) {
    let filmes = [
      "Drácula 3000, NÃO ASSISTA!",
      "Urge: Droga Mortal, um filme não compreendido pela academia",
      "Verdade ou Desafio, te desafio a ver esse filme!",
      "Tusk, Merecia Oscar!",
      "A Armadilha... qual deles?",
      "Esta Noite Encarnarei no teu cadaver.. isso foi um Aviso!",
      "The Velocipastor, :pray:",
      "o Filme da Piscina (12 Feet Deep)",
      "o Segredo da Cabana.. qual será? ?:thinking:",
      "Uma Noite Alucinante.. que titulo merda..",
      "A Visita.. puts, é Found Footage",
      "Rua Cloverfield 10, procura no Google Maps aí",
      "O Homem nas Trevas.. acende a luz!",
      "O Que Fazemos nas Sombras...?",
      "O Cubo.. cadê a Karina?",
      "A Morte te dá Parabéns, é Aniversário de quem?",
      "Drácula 2000, Incrível..",
      "O Enigma de Outro Mundo",
      "Downrange, HEADSHOT!",
      "Do Fundo do Mar, Cuidado pra não se Afogar!",
      "Bones - O Anjo das Trevas.. deve estar drogado",
      "A Hora da sua Morte.. é quando esse filme acaba"
  ];
  
    let resultado = Math.floor(Math.random() * filmes.length);
    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Filme`)
      .setColor(`RANDOM`)
      .addField("Recomendo: ", filmes[resultado]);
    message.delete().catch((O_o) => {});
    message.channel.send(Embed);
  }
} 