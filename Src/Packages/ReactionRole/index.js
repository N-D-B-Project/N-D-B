const mongoose = require("mongoose");
const schema = require("../../Database/Schema/ReactionRole");
const Logger = require("../../Utils/Tools/Logger");

module.exports = class ReactionRole {
    async setURL(dbURI) {
        if(!dbURI) throw new TypeError("MongoDB URI não foi definido");

        return mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {
            if (!err) {
                Logger.dtb("ReactionRole: MongoDB Conectado!");
              } else if (err) {
                Logger.error("MongoDB Error: \n" + err);
              }
        });
    }

    async reactionCreate(client, guildId, msgId, roleId, emoji, dm, option) {
        if (!client) throw new TypeError("Client não foi definido");
        if (!guildId) throw new TypeError("Guild não foi definido");
        if (!msgId) throw new TypeError("Message não foi definido");
        if (!emoji) throw new TypeError("Reaction/Emoji não foi definido");
        if(!roleId) throw new TypeError("RoleId não foi definido");
        dm = dm ? dm : false;
        if(!option) option = 1

        const check = await schema.findOne({ guildId: guildId , msgId: msgId , reaction: emoji , roleId: roleId });
        if (check) return false;

        const newReaction = new schema({
            guildId: guildId, 
            msgId: msgId, 
            reaction: emoji , 
            roleId: roleId,
            dm: dm,
            option: option
        });

        await newReaction.save().catch(e => client.logger.error(`Failed to create reaction role: ${e}`));
        client.react.set(msgId + emoji, { 
          guildId: guildId,
          msgId: msgId, 
          reaction: emoji, 
          roleId: roleId,
          dm: dm,
          option: option
        });

        return newReaction;
    }

    async reactionDelete(client, guildId , msgId, emoji) {
        if (!client) throw new TypeError("Client não foi definido");
        if (!guildId) throw new TypeError("Guild não foi definido");
        if (!msgId) throw new TypeError("Message não foi definido");
        if (!emoji) throw new TypeError("Reaction/Emoji não foi definido");
      
        
        const reactionRole = await schema.findOne({ guildId: guildId , msgId: msgId , reaction: emoji  });
        if (!reactionRole) return false;
    
        await schema.findOneAndDelete({ guildId: guildId , msgId: msgId , reaction: emoji, option: reactionRole.option }).catch(e => client.logger.error(`Reaction Delete Failed: ${e}`));
        
        client.react.delete(msgId + emoji);
        
        return reactionRole;
        
    }

    async reactionEdit(client, guildId , msgId, newroleId , emoji, dm, newoption) {
        if (!client) throw new TypeError("Client não foi definido");
        if (!guildId) throw new TypeError("Guild não foi definido");
        if (!msgId) throw new TypeError("Message não foi definido");
        if (!emoji) throw new TypeError("Reaction/Emoji não foi definido");
        if(!newroleId) throw new TypeError("RoleID não foi definido");
        dm = dm ? dm : false;
        if(!newoption) newoption = 1
        
        const reactionRole = await schema.findOne({ guildId: guildId , msgId: msgId , reaction: emoji  });
        if (!reactionRole) return false;
        reactionRole.roleId = newroleId;
    
        await reactionRole.save().catch(e => console.log(`Falha ao editar Reaction Role: ${e}`) );
        client.react.set(msgId + emoji, { 
          guildId: guildId,
          msgId: msgId, 
          reaction: emoji , 
          roleId: newroleId,
          dm: dm,
          option: reactionRole.option
        });
        return;
    }

    async reactionFetch(client, guildId ,msgId , emoji) {
        if (!client) throw new TypeError("Client não foi definido");
        if (!guildId) throw new TypeError("Guild não foi definido");
        if(!client.fetchforguild.has(guildId)){
        let allrole = await serverset.find({guildId: guildId}).sort([['guildId', 'descending']]).exec();
        let i = 0;
        for(i ; i < Object.keys(allrole).length; i++){
            await client.react.set(allrole[i].msgId+allrole[i].reaction, { 
                guildId: allrole[i].guildId,
                msgId: allrole[i].msgId, 
                reaction: allrole[i].reaction , 
                roleId: allrole[i].roleId,
                dm: allrole[i].dm
              }); 
            }
            client.fetchforguild.set(guildId, { 
              guildId: guildId,
              totalreactions: Object.keys(allrole).length
            });
        }
        return client.react.get(msgId + emoji); 
    }

    async reactionFetchAll(client) {
        if (!client) throw new TypeError("Client não foi definido");
        let all = await schema.find({}).sort([['guildId', 'descending']]).exec();
       
        return all; 
    }
}