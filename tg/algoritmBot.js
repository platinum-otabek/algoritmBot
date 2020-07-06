const Telegram = require('node-telegram-bot-api');
const token = '1395887812:AAHB3rnJZ83_ZXJds5vUIitbU3nbrPDTsVg';
const bot = new Telegram(token,{
    polling:true
});
const User = require('../models/User');
module.exports = ()=>{
    bot.onText(/\/start/, (msg) => {
            bot.sendMessage(msg.chat.id, 'Assalomu aleykum bu botda siz algoritm firmasiga zakaz berishingiz mumkin. Zakaz berish uchun /register buyrug`uni bosing');
    });

    bot.onText(/\/register/, (msg) => {
        const user = new User({
            chat_id: msg.chat.id,
            step_id: 'name',
        });
        const promise = user.save();
        promise.then((user) => {
            bot.sendMessage(msg.chat.id, 'Ismingizni kiriting');
        }).catch((err) => {
            console.log(err);
        });
    });

    bot.on('message', async (msg) => {
        if(msg.text !='/start' && msg.text != '/register'){
            // console.log(msg.contact.phone_number);
            const user = await User.findOne({
                chat_id: msg.chat.id
            })
            switch (user.step_id) {
                case "name":{

                    const updateName = User.updateOne({
                        chat_id: user.chat_id
                    }, {
                        $set: {
                            name: msg.text,
                            step_id: 'number'
                        }
                    });
                    updateName.then(() => {
                        bot.sendMessage(msg.chat.id, `${msg.text} nomeringizni jo'nating(+998947777777):`,{
                            reply_markup:{
                                keyboard:[
                                   [
                                       {
                                            text:'No`merni jo`natish',
                                            request_contact:true
                                        }
                                    ]
                                ]
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    })
                    break;
                }
                case "number":{
                    const number = msg.text || msg.contact.phone_number;
                    const updateNumber = User.updateOne({
                        chat_id: user.chat_id
                    }, {
                        $set: {
                            number: number,
                            step_id: 'location'
                        }
                    });
                    updateNumber.then(() => {
                        bot.sendMessage(msg.chat.id, `${user.name} Hududingizni tanlang:`,{
                            reply_markup:{
                                keyboard: [
                                    ['Toshkent','Buxoro'],
                                    ['Andijon','Farg`ona'],
                                    ['Jizzax','Samarqand'],
                                    ['Xorazm','Qoraqalpog`iston'],
                                    ['Namangan','Navoiy'],
                                    ['Qashqadaryo','Surxandaryo'],
                                    ['Sirdaryo'],
                                ]
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    })
                    break;
                }
                case "location":{
                    const updateLocation = User.updateOne({
                        chat_id: user.chat_id
                    }, {
                        $set: {
                            location: msg.text,
                            step_id: 'service_type'
                        }
                    });
                    updateLocation.then(() => {
                        bot.sendMessage(msg.chat.id, `${user.name} yo'nalishni tanlang`,{
                            reply_markup:{
                                keyboard:[
                                    ['Restaraunt','Fast Food'],
                                    ['Shirinlik','Dorixona'],
                                ]
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    })
                    break;
                }
                case "service_type":{
                    const updateService_type = User.updateOne({
                        chat_id: user.chat_id
                    }, {
                        $set: {
                            service_type: msg.text,
                        }
                    });
                    updateService_type.then( async () => {
                       await  bot.sendMessage(1284779507,`${user.name}:${user.number}:${user.location}:${msg.text}`)
                       await bot.sendMessage(msg.chat.id, `${user.name} biz bilan bo'lganinggizdan xursandmiz`,{
                            reply_markup:{
                                remove_keyboard:true
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    })
                    break;
                }
            }
        }


    });

}
