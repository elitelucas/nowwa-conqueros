import Authentication from './Authentication';
import Database from './Database';
import { Custom, CustomProperty, CustomType, CustomDocument } from './Models/Custom';

class Test {

    public static async Run () {
        // TEST : authentication
        // await Authentication.Login({
        //    Username: 'user010',
        //    Password: 'user010' 
        // })
        //     .then((user) => {
        //         console.log(`success login: ${user.username}`);
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });

        
        // TEST : database  
        // try {
        //     let schemaName:string = `schema001`;
    
        //     let structures:CustomType[] = await Database.StructureLoad([schemaName]);
        //     console.log(JSON.stringify(structures));
    
        //     let structureSchema001 = structures[0];
        //     console.log('structureSchema001', JSON.stringify(structureSchema001));
    
        //     structureSchema001 = await Database.StructureSave(structureSchema001.schemaName, {
        //         add: {
        //             field005: 'number',
        //         },
        //         remove: [
        //             'field001'
        //         ]
        //     });
        //     console.log('structureSchema001 updated', JSON.stringify(structureSchema001));
    
        //     structureSchema001 = (await Database.StructureLoad([structureSchema001.schemaName]))[0];
        //     console.log('structureSchema001 updated', JSON.stringify(structureSchema001));
    
        //     let dataSchema001 = await Database.DataSave(structureSchema001.schemaName, {
        //         values: {
        //             field002: true
        //         }
        //     });
        //     console.log(JSON.stringify(dataSchema001));
    
        //     let searchSchema001 = await Database.DataLoad(structureSchema001.schemaName, {
        //         where: {
        //             field002: true
        //         }
        //     });
        //     console.log(JSON.stringify(searchSchema001));
        // }
        // catch (error) {
        //     console.log(error);
        // }

        console.log('done tests');


        // let indexes = await Custom.listIndexes();
        // console.log(indexes);
        // //@ts-ignore
        // Custom.collection.dropIndex('name_1');
        // console.log(mongoose.connection.models);
        // await Custom.deleteMany({}).exec();
        // let customs = await Custom.find({}).exec();
        // console.log(customs);

        // let structures = await Custom.findOne({ schemaName: 'schema001' }).exec();
        // console.log(structures);

        // let custom:CustomType = {
        //     schemaName      : "schema001",
        //     schemaFields    : {
        //         field003    : 'number',
        //         field005    : 'string',
        //         field007    : 'number',
        //         field009    : 'boolean'
        //     }
        // } 
        // if (!Database.Instance.models[custom.schemaName]) {
        //     Database.Instance.models[custom.schemaName] = Database.CreateModel(custom.schemaName, custom.schemaFields);
        // }
        // let model = Database.Instance.models[custom.schemaName];
        // // await model.deleteMany({}).exec();
        // // let testnew = await model.create({
        // //     field003: 10,
        // //     field005: 'hehe',
        // //     field007: 199,
        // //     field009: false
        // // });
        // let documents = await model.find({
        //     field005 : "the string x",
        //     field007 : {
        //         $lt : -500
        //     }
        // }).exec();
        // console.log(documents);
        
        // const newFiledoc = new Filedoc({
        //     filename    : 'file001',
        //     fileurl     : 'fileurl001',
        //     extension   : 'txt'
        // });
        // await newFiledoc.save();
        // console.log('save filedoc');

        // const newUser = new User({ 
        //     username    : 'user010',
        //     password    : 'user010' 
        // });
        // newUser.files.push(newFiledoc);
        // console.log('add filedoc');

        // await newUser.save();
        // console.log('add new user');

        // let user = await User.findOne({
        //     username    : 'user010'
        // });
        // console.log(user);
    }

}

export default Test;