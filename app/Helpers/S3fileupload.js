'use strict'
const Drive=use('Drive')
const _RL =use('App/Helpers/ResponseLibrary');
const Antl = use('Antl')
const Env=use('Env')


const Helpers = use('Helpers')
class S3fileupload{
    constructor(){
        this.extname=null;
    }
    async extName(){
        return this.extname;
    }
   async setName(name){
        this.extName=name;
   }
    async s3SingleUpload(request,response,directory){   
       
        //try{        
         const validationOptions = {
            types: ['jpeg', 'jpg','png',''],
            size: '50mb'
          }
          var pathfile=`${directory}/${Math.round(new Date().getTime())}`;
          request.multipart.file('file', validationOptions, async file => {
            // set file size from stream byteCount, so adonis can validate file size
            file.size = file.stream.byteCount
            //this.extname=file.extname;
            await this.setName('png');
            console.log(file.extname,'file details***************')
        
            // run validation rules
            await file.runValidations()
        
            //catches validation errors, if any and then throw exception
            const error = file.error()
            if (error.message) {
              throw new Error(error.message)
            }               
            // upload file to s3
            console.log(pathfile)
            await Drive.disk("s3").put(pathfile, file.stream, {
              ContentType: file.headers['content-type'],
              ACL: 'public-read'
            })
          })
        
          //let url=await Drive.disk('s3').getUrl(directory);

          let url =Env.get('ASSET_URL_S3')+''+pathfile;
          // You must call this to start processing uploaded file
          await request.multipart.process()
          return _RL.apiResponseOk(response,Antl.formatMessage('messages.imageUpload'),{url:url});
        // }
        // catch(e){
        //     console.log(e)     
        //     return e;       
        // }      
        
    }

    //Returning only url 
    async s3SingleUploadUrl(request,response,directory){   
       
     // try{        
       const validationOptions = {
          types: ['jpeg', 'jpg','png',''],
          size: '50mb'
        }
        var pathfile=`${directory}/${Math.round(new Date().getTime())}`;
        request.multipart.file('file', validationOptions, async file => {
          // set file size from stream byteCount, so adonis can validate file size
          file.size = file.stream.byteCount
          //this.extname=file.extname;
          await this.setName('png');
          console.log(file.extname,'file details***************')
      
          // run validation rules
          await file.runValidations()
      
          //catches validation errors, if any and then throw exception
          const error = file.error()
          if (error.message) {
            throw new Error(error.message)
          }               
          // upload file to s3
          console.log(pathfile)
          await Drive.disk("s3").put(pathfile, file.stream, {
            ContentType: file.headers['content-type'],
            ACL: 'public-read'
          })
        })
      
        //let url=await Drive.disk('s3').getUrl(directory);

        let url =Env.get('ASSET_URL_S3')+''+pathfile;
        // You must call this to start processing uploaded file

        const body = {};
        await request.multipart.field((name, value) => {
            console.log(name,'name log***************');
            body[name] = value;
        });
        body.url=url;
       await request.multipart.process();
      
        return body;
      // }
      // catch(e){
      //     console.log(e)     
      //     return e;       
      // }      
      
  }

  async requestBody(request){
    const body = {};
    await request.multipart.field((name, value) => {        
        body[name] = value;
    });
    await request.multipart.process();
    return body;
  } 


  //Multiple upload in s3
  async s3MultipleUpload(request,response,directory){   
       
    for (let i = 0; i < 7; i++) {
      console.log('under loop');
      request.multipart.file('file', {}, async file => {

        await Promise.all([
          Drive.disk('s3').put(Helpers.tmpPath(`1.${file.subtype}`), file.stream),
          Drive.disk('s3').put(Helpers.tmpPath(`2.${file.subtype}`), file.stream)
        ]);

        console.log('under upload');
        // const transform = sharp()
        //   .resize(400,400, {
        //     quality: 80,
        //     fit: 'contain',
        //     background: { r: 255, g: 255, b: 255, alpha: 1 }
        //   })
        //   .jpeg({quality: 100})
        //   .toFormat('jpeg')
         
        //   await Drive.disk('s3').put('multipart/' + Math.random().toString(10).substring(7) + '.jpg', file.stream.pipe(transform).pipe(file.stream), {
        //     ContentType: file.headers['content-type'],
        //     ACL: 'public-read'
        //   })
       })
      }
      await request.multipart.process()
    }
 
}

let fileUploadobj=new S3fileupload();
//export default fileUploadobj;
module.exports=fileUploadobj;