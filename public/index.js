$(document).ready(function(){
    var connectionOptions={
        "force new connection":true,
        "reconnectionAttempts":"Infinity",
        "timeout":10000,
        "transports":["websocket"]
    }
    var socket=io.connect("https://realtimrandhistoricaldata.herokuapp.com",connectionOptions);
    $('#add-data').click(function(){
        socket.emit("add-data");
        $('#add-data').css("display","none");
        $("#data-table-div").css("display","block");
        alert("wait some time to see data");
    })
    function createRows(realTimeData){
        var count=0;
        var getRowslist=document.getElementsByClassName("data-row");
        var col1=document.getElementsByClassName("column1");
        var col2=document.getElementsByClassName("column2");
        var col3=document.getElementsByClassName("column3");
        
        if(getRowslist.length === 20){
            
            for(var i=0;i<realTimeData.length;i++){
                col1[i].innerText=realTimeData[i].Temperature;
              
                col2[i].innerText=realTimeData[i]. BatteryLevel;
                col3[i].innerText=realTimeData[i].TimeStamp;
            }
            count++;
        }if(count===0){
            for(var i=0;i<realTimeData.length;i++){
            var dataRow=$("<tr>").addClass("data-row");
            var tabledata1=$("<td>").addClass("column1").html(realTimeData[i].Temperature);
            var tabledata2=$("<td>").addClass("column2").html(realTimeData[i]. BatteryLevel);
            var tabledata3=$("<td>").addClass("column3").html(realTimeData[i].TimeStamp);
            dataRow.append(tabledata1,tabledata2,tabledata3);
            $("#table-content").append(dataRow);
            }
        }
    }
    socket.on('realtime-data' ,function(dataArray){
         createRows(dataArray)
         console.log(dataArray);
    })
})