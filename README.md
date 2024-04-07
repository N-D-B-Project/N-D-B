<h1 align="center">
  <br>
  <img width="35" src="https://github.com/NedcloarBR/N-D-B/blob/master/Packages/Client/src/common/assets/Images/Logos/Logo.png?raw=true"> N-D-B
  <br>
</h1>

<h3 align=center>Um Bot totalmente customizável feito com <a href=https://github.com/discordjs/discord.js>discord.js</a></h3>

<div align=center>

[![Discord](https://img.shields.io/discord/679066351456878633.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/5CHARxbaRk)
[![Linhas de Código](https://sonarcloud.io/api/project_badges/measure?project=NedcloarBR_N-D-B&metric=ncloc)](https://sonarcloud.io/dashboard?id=NedcloarBR_N-D-B)
[![CodeFactor](https://www.codefactor.io/repository/github/nedcloarbr/n-d-b/badge)](https://www.codefactor.io/repository/github/nedcloarbr/n-d-b)
[![Crowdin](https://badges.crowdin.net/n-d-b/localized.svg)](https://crowdin.com/project/n-d-b)

</div>

<p align="center">
  <a href="#❓ Sobre">Sobre</a>
  •
  <a href="📝 To-Do">To-Do</a>
  •
  <a href="https://github.com/NedcloarBR/N-D-B/blob/master/Docs/Configuration.md">Instalação</a>
  •
  <a href="#📖 Licença">Licença</a>
  •
  <a href="#🗞️ Créditos">Créditos</a>
</p>

## ❓ Sobre

N-D-B é um Bot do Discord de Código Aberto totalmente personalizável em constante crescimento com foco em melhorar sua experiencia nos servidores! Você pode convida-lo para seu servidor clicando [aqui](https://discord.com/oauth2/authorize?client_id=708822043420000366&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fredirect&scope=bot%20applications.commands)! Você também pode se juntar ao meu servidor oficial [NedcloarBR Community](https://discord.gg/5CHARxbaRk) para dar suas sugestões, tirar duvidas e pedir assistência! O Bot vem com muitos tipos de comandos e recursos para sua melhor experiencia!

Se você gostou do projeto, sinta-se livre para deixar aquela ⭐ aqui no Github para ele crescer cada vez mais!

## 📝 To-Do

- [ ] Multilingual README in Docs
- [ ] Update [Configuration](https://github.com/NedcloarBR/N-D-B/blob/master/Docs/Configuration.md) and [Examples](https://github.com/NedcloarBR/N-D-B/tree/master/Docs/Examples)
- [ ] [Bot Client](https://github.com/NedcloarBR/N-D-B/tree/master/Packages/Client/src/modules/bot)
  - [ ] Systems
    - [ ] Moderation
      - [ ] Manual
      - [ ] Automatic
    - [ ] Economy
    - [ ] Starboard
    - [ ] Tickets
    - [ ] System Logs
    - [ ] Update from [Legacy Branch](https://github.com/NedcloarBR/N-D-B/tree/Pure-DiscordJS) to [Necord](https://necord.org/) with my custom handle system
      - [ ] ReactionRoles
        - [x] Partial migrated to Necord but not tested yet
        - [ ] Commands Update(Legacy/Slash), Builder(Legacy), Fetch(Legacy/Slash)
        - [ ] Update ReactionRoleAdd/Remove Events
        - [ ] Make [UnableToCreateReactionRoleEmbed](https://github.com/NedcloarBR/N-D-B/blob/master/Packages/Client/src/modules/reactionRoles/ReactionRoles.embeds.ts#L227) more   beautiful
      - [ ] Music
      - [ ] Full or Partial Clone [NQN](https://nqn.blue/)
        - [x] Partial
        - [ ] Reenable when fix some bugs
        - [ ] Full
    - [ ] Sharding
      - [x] Initial Sharding System
      - [ ] Sharding related commands
    - [ ] Top.gg
      - [x] Status Autopost
      - [ ] Vote Reward System
- [ ] [API](https://github.com/NedcloarBR/N-D-B/tree/master/Packages/Client/src/modules/api)
  - [ ] Port from [Legacy Branch](https://github.com/NedcloarBR/N-D-B/tree/Pure-DiscordJS)
    - [x] Auth Module
    - [x] Discord Module
    - [ ] Guild Module
  - [x] Change Auth from Session to JWT
  - [x] Use [Fastify](https://fastify.dev/) instead of [Express](https://expressjs.com/)
  - [ ] Use i18n to localize api messages
- [ ] Tests
  - [x] Configure [Vitest](https://vitest.dev/) as Tester instead of [Jest](https://jestjs.io/)
  - [x] Generate Coverage
  - [x] GitHub action to auto run tests and generate coverage after a push in repository
  - [ ] E2E
  - [ ] Unit
- [ ] [.github](https://github.com/NedcloarBR/N-D-B/tree/master/.github)
  - [x] Update actions versions
  - [x] Label sync action

## 📖 Licença

Lançado sob a [GPL-3.0 License](https://github.com/NedcloarBR/N-D-B/blob/master/License) license.

## 🗞️ Créditos

- **OBS** Quase todos os repositórios que eu utilizar como referencia para a criação do N-D-B estarão citados abaixo e sempre irei fazer alterações no projeto original para se encaixar melhor ao sistema existente do N-D-B e também não ser totalmente uma "copia" deles

- Quer ver seu nome nesta lista? - veja a pagina de [Contribuição](https://github.com/NedcloarBR/N-D-B/blob/master/Docs/CONTRIBUTING.md).
