import express, { response } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose, { mongo } from 'mongoose';
import session from 'express-session';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { load } from 'ts-dotenv';
import { User, UserDocument } from './Models/User';
import { Custom, CustomProperty, CustomType } from './Models/Custom';
import Environment from './Environment';
import crypto from 'crypto';
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './Interfaces/SocketInterfaces';

console.log(`project path: ${__dirname}`);

const envPath = path.resolve(__dirname, `../../.env`);
console.log(`load .env from: ${envPath}`);
const env = load(Environment, {
    path: envPath,
    encoding: 'utf-8',
}); 

const ReservedSchemaName:string[] = [
    'User',
    'Custom',
    'File'
];

const MapSchemaTypesList:string[] = [
    'string',
    'number',
    'boolean',
    'object',
    'date'
];
    
type MapSchemaTypes = {
    string      : string;
    number      : number;
    boolean     : boolean;
    object      : object;
    date        : Date;
}

class Main {

    private secret:string = "conqueros";

    private baseUrl:string = `/webhook/v${env.VERSION}`;

    private models:{[key:string]:mongoose.Model<any, {}, {}>};

    constructor () {
        this.models = {};
        this.Initialize();
    }

    /**
     * Initialize necessary components.
     */
    private async Initialize () {
        console.log(`initialize...`);
        this.InitExpress();
        this.InitDatabase();
        this.InitCloudinary();
        this.InitSocket();
    }

    /**
     * Initialize express.
     */
    private async InitExpress ():Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:Main = this;

            var app:express.Express = express();
            app
                .use(express.json())
                .use(express.urlencoded({
                    extended            :false
                }))
                .use(cors())
                .use(session({ 
                    genid               : () => crypto.randomBytes(48).toString('hex'),
                    secret              : self.secret,
                    resave              : true,
                    saveUninitialized   : true,
                    cookie              : {
                        maxAge          : (1000 * 60 * 100)
                    }
                }))
                .use(passport.initialize())
                .use(passport.session());

            self.InitAuthentication();

            self.ExpressGetDefault(app);
            self.ExpressPostAuthenticate(app);
            self.ExpressPostRegister(app);
            self.ExpressPostUpload(app);
            self.ExpressPostSchemaStructureSave(app);
            self.ExpressPostSchemaStructureLoad(app);
            self.ExpressPostSchemaDataSave(app);
            self.ExpressPostSchemaDataLoad(app);
    
            app.listen(env.MAIN_PORT);
            console.log(`[Express] listening on port ${env.MAIN_PORT}`);
        }
        catch (error) {
            console.error(<Error>error);
        }
    }

    /**
     * Set express response for GET default '/' call.
     */
    private async ExpressGetDefault (app:express.Express) {
        console.log(`set express get default...`);
    
        var self:Main = this;
    
        app.get(`${self.baseUrl}`, (req, res) => {
            console.log('<-- request default');
            res.send({ success: true });
        });
    }

    /**
     * Set express response for POST '/authenticate' call.
     */
    private async ExpressPostAuthenticate (app:express.Express) {
        console.log(`set express post authenticate...`);
    
        var self:Main = this;
    
        app.post(`${self.baseUrl}/authenticate`, (req, res) => {
            console.log(`<-- request authenticate`);
            // console.log(`req.body.username: ${req.body.username}`);
            // console.log(`req.body.password: ${req.body.password}`);
            self.UserAuthenticate({username:req.body.username, password:req.body.password})
            .then((user) => {
                res.send({ success: true, value: user });
            })
            .catch((error) => {
                res.send({ success: false, error: error.message });
            });
        });

    }

    /**
     * Authenticate user.
     * @param username 
     * @param password 
     */
    private async UserAuthenticate (args:{username:string, password:string}) {
        return new Promise((resolve, reject) => {
            var req:any = { 
                body: { 
                    username: args.username,
                    password: args.password
                }
            };
            passport.authenticate('local', (error:Error, user?:any) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(user);
                }
            })(req, null);
        });
    }

    /**
     * Set express response for POST '/register' call.
     */
    private async ExpressPostRegister (app:express.Express) {
        console.log(`set express post register...`);
    
        var self:Main = this;
    
        app.post(`${self.baseUrl}/register`, (req:express.Request, res:express.Response) => {
            console.log(`<-- request register`);
            // console.log(`req.body.username: ${req.body.username}`);
            // console.log(`req.body.password: ${req.body.password}`);
            User.findOne({ username: req.body.username }, async (error:any, user?:any) => {
                if (error) { 
                    return res.send({ success: false, error: error.message });
                }
                if (user) { 
                    return res.send({ success: false, error: "user already exists!" });
                }
                const newUser = new User({ username: req.body.username, password: req.body.password });
                await newUser.save();
                return res.send({ success: true, value: newUser });
            });
        });
    }

    /**
     * Set express response for POST '/upload' call.
     */
    private async ExpressPostUpload (app:express.Express) {
        console.log(`set express post upload...`);
    
        var self:Main = this;
        
        var storage = multer.diskStorage({ 
            destination: (req, file, callback) => {
                callback(null, path.resolve(__dirname, '../../temp/'));
            },
            filename: (req, file, callback) => {
                /*
                var extensionRegex:RegExp = /[^.]+$/i;
                var extension = file.originalname.match(extensionRegex);
                if (extension != null) {
                    var extensionName = extension[0];
                    var fieldName:string = file.fieldname;
                    callback(null, `${fieldName}.${extensionName}`);
                }
                callback(null, `${fieldName}.${extensionName}`);
                */
                callback(null, file.originalname);
            }
        });

        var upload = multer({ storage: storage });
    
        app.post(`${self.baseUrl}/upload`, upload.single('fld_file_0'), (req, res) => {
            console.log(`<-- request upload`);

            var file:Express.Multer.File | undefined = req.file;
            
            if (typeof (file) != `undefined`) {
                console.log(`upload file to cloudinary...`);
                cloudinary.v2.uploader.upload(file.path, (error) => {
                    if (error) {
                        // The results in the web browser will be returned inform of plain text formart. We shall use the util that we required at the top of this code to do this.
                        res.send({ success: false, error: error.message });
                    }
                })
                .then(response => {
                    res.send({ 
                        success: true, 
                        message: 'file uploaded!',
                        response: response
                    });
                })
                .catch((error:Error) => {
                    res.send({ success: false, error: error.message });
                });
            } else {
                res.send({ success: false, error: "file uploaded fails..." });
            }

        });
    }

    /**
     * Upload file stream to cloudinary.
     */
    private async CloudinaryUploadFileStream (user:UserDocument) {
        if (!user) {
            throw new Error('each file must have a user!');
        }

        return new Promise((resolve,reject) => {
            cloudinary.v2.uploader.upload_stream({

            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Initialize database connection.
     */
    private async InitDatabase () {
        console.log(`init database...`);

        var self:Main = this;

        var uri:string = `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASS}@${env.MONGODB_HOST}/${env.MONGODB_DB}`;
        console.log(`connect to: ${uri}`);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false,
            sslCert: `${env.MONGODB_CERT}`
        })
        .catch((error:Error) => {
            console.error("Connection error", error);
            throw error;
        });

        console.log("Successfully connect to MongoDB.");

        // // Test model
        await (async () => {

            try {
                // var indexes = await Custom.listIndexes();
                // console.log(indexes);
                // //@ts-ignore
                // Custom.collection.dropIndex('name_1');
                // console.log(mongoose.connection.models);
                // await Custom.deleteMany({}).exec();
                // var customs = await Custom.find({}).exec();
                // console.log(customs);
    
                // var structures = await Custom.findOne({ schemaName: 'schema001' }).exec();
                // console.log(structures);
    
                // var custom:CustomType = {
                //     schemaName      : "schema001",
                //     schemaFields    : {
                //         field003    : 'number',
                //         field005    : 'string',
                //         field007    : 'number',
                //         field009    : 'boolean'
                //     }
                // } 
                // if (!self.models[custom.schemaName]) {
                //     self.models[custom.schemaName] = self.DatabaseCreateCustomModel(custom.schemaName, custom.schemaFields);
                // }
                // var model = self.models[custom.schemaName];
                // // await model.deleteMany({}).exec();
                // // var testnew = await model.create({
                // //     field003: 10,
                // //     field005: 'hehe',
                // //     field007: 199,
                // //     field009: false
                // // });
                // var documents = await model.find({
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

                // var user = await User.findOne({
                //     username    : 'user010'
                // });
                // console.log(user);
            }
            catch (error) {
                console.error(error);
            }

        })();
    }

    /**
     * Load custom models for database.
     */
    private async DatabaseLoadSchemaStructures (schemaNames?:string[]):Promise<CustomType[]> {
        console.log(`load custom schemas...`);
        try {
            var query;
            if (schemaNames) {
                var $or:{[key:string]:any}[] = [];
                for (var i = 0; i < schemaNames.length; i++) {
                    $or.push({
                        [`${CustomProperty.schemaName}`]  : schemaNames[i]
                    });
                }
                query = Custom.find({
                    $or: $or 
                });
            } else {
                query = Custom.find({ });
            }
            query.select(`${CustomProperty.schemaName} ${CustomProperty.schemaFields}`);
            var data = await query.exec();
            var output = [];
            for (var i = 0; i < data.length; i++) {
                output.push({
                    schemaName      : data[i].schemaName,
                    schemaFields    : data[i].schemaFields
                });
            }
            return Promise.resolve(output);
        } catch (error:any) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    /**
     * Create custom model for database.
     */
    private DatabaseCreateCustomModel (schemaName:string, fields:any) {
        console.log(`database create custom model...`);
          
        type MapSchema<T extends Record<string, keyof MapSchemaTypes>> = {
            -readonly [K in keyof T]: MapSchemaTypes[T[K]]
        }

        function asSchema<T extends Record<string, keyof MapSchemaTypes>>(t: T): T {
            return t;
        }
        // var fields = rawFields instanceof Map ? Object.fromEntries(rawFields) : rawFields;
        var data = asSchema(fields);
        var structure = {};
        var fieldNames = Object.keys(fields);
        for (var i:number = 0; i < fieldNames.length; i++) {
            var fieldName = fieldNames[i];
            var fieldType = fields[fieldName];
            if (fieldType == 'string') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : String
                    }
                };
            } 
            else if (fieldType == 'number') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : Number
                    }
                };
            }
            else if (fieldType == 'boolean') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : Boolean
                    }
                };
            }
            else if (fieldType == 'date') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : Date
                    }
                };
            }
            else if (fieldType == 'object') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : mongoose.Schema.Types.Mixed
                    }
                };
            }
        }
        type DataType = MapSchema<typeof data>;
        
        type NewDocument = mongoose.Document & DataType;

        const NewSchema = new mongoose.Schema<NewDocument>(structure, {
            strict      : "throw"
        });

        console.log(`database custom model '${schemaName}' created!`);
        return mongoose.model(schemaName, NewSchema);
    }

    /**
     * Initialize authentication using Core.
     */
    private InitAuthentication () {
        console.log(`init authentication...`);

        var self:Main = this;

        passport.use(new passportLocal.Strategy({
            passwordField: "password",
            usernameField: "username"
        }, (username, password, done) => {
            User.findOne({ username: username }, async (error:Error, user?:any) => {
                if (error) { return done(error); }
                if (!user) { return done(new Error("user does not exists"), false); }
                user.verifyPassword(password, (error:Error, isMatch:boolean) => {
                    if (error) { return done(error); }
                    if (!isMatch) { return done(new Error("incorrect password"), false); }
                    return done(null, user);
                });
            });
        }));
    }

    /**
     * Initialize Cloudinary usage.
     */
    private InitCloudinary () {
        console.log(`init cloudinary...`);

        var self:Main = this;

        console.log(`set cloudinary config...`);
        cloudinary.v2.config({
            cloud_name  : `${env.CLOUDINARY_NAME}`,
            api_key     : `${env.CLOUDINARY_KEY}`,
            api_secret  : `${env.CLOUDINARY_SECRET}`,
        });
    }

    /**
     * Create or modify a custom schema structure.
     */
    private ExpressPostSchemaStructureSave (app:express.Express) {
        console.log(`set express post schema structure save...`);
    
        var self:Main = this;

        app.post(`${self.baseUrl}/schema_structure_save`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema structure save`);

            var schemaFields = req.body.schemaFields;
            var schemaName = req.body.schemaName;

            try {
                if (ReservedSchemaName.includes(schemaName)) {
                    throw new Error(`schema name '${schemaName}' is not allowed!`);
                }

                var finalFields:{[key:string]:string} = {...schemaFields.add};
                var finalFieldNames:string[] = Object.keys(finalFields);
                for (var i:number = 0; i < finalFieldNames.length; i++) {
                    var finalFieldName:string = finalFieldNames[i];
                    var finalFieldType:string = finalFields[finalFieldName];
                    if (MapSchemaTypesList.indexOf(finalFieldType) < 0) {
                        throw new Error(`field '${finalFieldName}' has an invalid type of '${finalFieldType}'!`);
                    }
                }

                // Check if old schema exists
                var originalFilter:CustomType = {
                    schemaName      : schemaName
                };
                var query = Custom.findOne(originalFilter);
                var structure = await query.exec();
                if (structure) {
                    
                    // Check loaded models
                    var model = self.models[schemaName];
                    if (model) {
                        for (var i:number = 0; i < finalFieldNames.length; i++) {
                            var finalFieldName:string = finalFieldNames[i];
                            if (!structure.schemaFields[finalFieldName]) {
                                model.schema.add({
                                    [finalFieldName] : finalFields[finalFieldName]
                                });
                            }
                        }
                    }

                    // Combine old fields with new fields
                    finalFields = {
                        ...structure.schemaFields,
                        ...finalFields,
                    };
                    if (schemaFields.remove) {
                        for (var i = 0; i < schemaFields.remove.length; i++) {
                            var schemaFieldName = schemaFields.remove[i];
                            delete finalFields[schemaFieldName];
                            if (model) {
                                if (!model.schema.path(schemaFieldName)) {
                                    throw new Error(`field '${schemaFieldName}' cannot be removed as it does not exists!`);
                                }
                                model.schema.remove(schemaFieldName);
                            }
                        }
                    }
                    console.log('finalFields after', finalFields);
                    structure.schemaFields = finalFields;
                    structure.markModified(CustomProperty.schemaFields);
                    structure = await structure.save();
                } else {
                    var newStructure:CustomType = {
                        schemaName      : schemaName,
                        schemaFields    : finalFields 
                    }
                    structure = await Custom.create(newStructure);
                }
                res.send({ 
                    success         : true, 
                    value           : structure
                });

            } 
            catch (error) {
                res.send({ success: false, error: (<Error>error).message });
            }
        });
    }

    /**
     * Load one or all custom schema structures.
     */
    private ExpressPostSchemaStructureLoad (app:express.Express) {
        console.log(`set express post add custom schema...`);
    
        var self:Main = this;

        app.post(`${self.baseUrl}/schema_structure_load`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema structure load`);

            try {
                var schemaNames = req.body.schemaNames;
                var schemas:CustomType[] = await self.DatabaseLoadSchemaStructures(schemaNames);
                res.send({ success: true, value: schemas });
            } 
            catch (error) {
                res.send({ success: false, error: (<Error>error).message });
            }
        });
    }

    /**
     * Create or modify a custom schema data.
     */
     private ExpressPostSchemaDataSave (app:express.Express) {
        console.log(`set express post schema data save...`);
    
        var self:Main = this;

        app.post(`${self.baseUrl}/schema_data_save`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema data save`);

            var schemaFields = req.body.schemaFields;
            var schemaName = req.body.schemaName;

            try {
                // Check schema structure
                var schemas:CustomType[] = await self.DatabaseLoadSchemaStructures([schemaName]);
                if (schemas) {
                    if (!self.models[schemaName]) {
                        console.log(`register new model: ${schemaName}...`);
                        self.models[schemaName] = self.DatabaseCreateCustomModel(schemaName, schemas[0].schemaFields);
                    }
                    var model = self.models[schemaName];

                    if (schemaFields.where) {
                        var query = model.find(schemaFields.where).limit(1);
                        var documents = await query.exec();
                        if (documents && documents.length == 1) {
                            var document = documents[0];
                            var fieldNames = Object.keys(schemaFields.values);
                            for (var i:number = 0; i < fieldNames.length; i++) {
                                var fieldName = fieldNames[i];
                                var fieldValue = schemaFields.values[fieldName];
                                document.schemaFields[fieldName] = fieldValue;
                            }
                            await document.save();
                            res.send({ success: true, value: document });
                            return;
                        }
                        res.send({ success: false, error: 'matching entry not found!' });
                        return;
                    }
                    console.log('schemaFields.values', schemaFields.values);
                    var document = await model.create(schemaFields.values);
                    console.log('document', document);
                    res.send({ success: true, value: document });
                    return;
                }
                res.send({ success: false, error: `schema '${schemaName}' not found!` });

            } 
            catch (error) {
                res.send({ success: false, error: (<Error>error).message });
            }
        });
    }

    /**
     * Load a custom schema data.
     */
     private ExpressPostSchemaDataLoad (app:express.Express) {
        console.log(`set express post schema data load...`);
    
        var self:Main = this;

        app.post(`${self.baseUrl}/schema_data_load`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema data load`);

            var schemaFields = req.body.schemaFields;
            var schemaName = req.body.schemaName;

            try {
                // Check schema structure
                var schemas:CustomType[] = await self.DatabaseLoadSchemaStructures([schemaName]);
                if (schemas && schemas.length > 0) {
                    if (!self.models[schemaName]) {
                        console.log(`register new model: ${schemaName}...`)
                        self.models[schemaName] = self.DatabaseCreateCustomModel(schemaName, schemas[0].schemaFields);
                    }
                    var model = self.models[schemaName];
                    var query = model.find(schemaFields.where || {});
                    if (schemaFields.limit) {
                        query.limit(schemaFields.limit);
                    }
                    var documents = await query.exec();
                    res.send({ success: true, value: documents });
                    return;
                }
                res.send({ success: false, error: `schema '${schemaName}' not found!` });

            } 
            catch (error) {
                res.send({ success: false, error: (<Error>error).message });
            }
        });
    }

    /**
     * Initialize socket feature.
     */
    private InitSocket () {

        var self:Main = this;

        var httpServer = createServer();
        var io:Server = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
            httpServer,
            {
                cors: {
                    origin: "*"
                }
            }
        );

        io.on("connection", (socket) => {
            socket.emit("noArg");
            socket.emit("basicEmit", 1, "2", Buffer.from([3]));
            socket.emit("withAck", "4", (e:any) => {
            // e is inferred as number
                console.log(`e: ${e}`);
            });
        
            // works when broadcast to all
            io.emit("noArg");
        
            // works when broadcasting to a room
            io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));

            socket.on('fromClient', (args:any) => {
                console.log(`[socket] [client:${socket.id}]: ${JSON.stringify(args)}`); 
                // send echo
                socket.emit('fromServer', args);
                socket.broadcast.emit('fromServer', `[broadcast: ${socket.id}]: ${JSON.stringify(args)}`); // sender does not get the broadcast
            });

            socket.on('authenticate', (args:any) => {
                self.UserAuthenticate({username:args.username, password:args.password})
                .then((user) => {
                    socket.emit('fromServer', { success: true, value: user });
                })
                .catch((error) => {
                    socket.emit('fromServer', { success: false, error: error.message || error });
                });
            });

            socket.on('register', (args:any) => {
                var req:any = { 
                    body: { 
                        username: args.username,
                        password: args.password
                    }
                };
                User.findOne({ username: req.body.username }, async (error:any, user?:any) => {
                    if (error) { 
                        return socket.emit('fromServer', { success: false, error: error.message });
                    }
                    if (user) { 
                        return socket.emit('fromServer', { success: false, error: "user already exists!" });
                    }
                    const newUser = new User({ username: req.body.username, password: req.body.password });
                    await newUser.save();
                    return socket.emit('fromServer', { success: true, value: newUser });
                });
            })

        });

        io.listen(env.SOCKET_PORT);
    }

}

var c:Main = new Main();