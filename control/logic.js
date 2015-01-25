/**
 * Created by vimukthiw on 12/20/14.
 */
var toObj=require('../control/stringToJSON');
var trip=require('../control/trip');
var db=require('../model/mongoDBhandler');


var arr=[];
var tripdata=[];
var ready=false;


exports.direct=function(data){
    if(ready){
        var obj=toObj.convert(data);
        var numtime=(obj.sent.getHours()*100) + (obj.sent.getMinutes());
        var filobj=tripdata.filter(function(element){
            return (element.imei==obj.imei)&&(element.starting<numtime)&&(numtime<element.ending);
        });
        if(filobj.length>0){
            var tripname=filobj[0].tripid;
            if(arr[tripname]==undefined){
                var temp=new trip(tripname);
                temp.loadData();
                arr[tripname]=temp;
                arr[tripname].loadData();
            }
            arr[tripname].cal(obj);

        }
        
        else console.log('Invalid data from server');

    }
    
    else console.log('Initial data has not finished fetching');
    

}


exports.loadData=function(){
    db.getTripFromEmei(function(collection){
        collection.find().toArray(function(err, items) {
            tripdata=items;
            module.exports.testdata=tripdata;
            ready=true;
        });
        
    });
}

