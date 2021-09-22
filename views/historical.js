$(document).ready(function(){
    console.log("script loadded");
    var startTime=document.getElementById("start");
    var startDate=document.getElementById("start-date");
    var endTime=document.getElementById("end");
    var endDate=document.getElementById("end-date");
    
    
    $("#btn-ok").click(async function(){
        if(startTime.value === "" || startDate.value==="" || endTime.value==="" || endDate.value===""){
            return alert("select values");
        }else{
            var Obj={
                start:startDate.value+"---"+startTime.value,
                end:endDate.value+"---"+endTime.value
            }
            await $.post("http://localhost:3000/historicalData",Obj,function(data){
                    if(data.status===200){
                        $("#error-message-div").css("display","none");
                        $("#data-table-div").css("display","block");
                       
                        for(var i=0;i<data.result.length;i++){
                            var dataRow=$("<tr>").addClass("data-row");
                            var tabledata1=$("<td>").addClass("column1").html(data.result[i].Temperature);
                            var tabledata2=$("<td>").addClass("column2").html(data.result[i]. BatteryLevel);
                            var tabledata3=$("<td>").addClass("column3").html(data.result[i].TimeStamp);
                            dataRow.append(tabledata1,tabledata2,tabledata3);
                            $("#table-content").append(dataRow);
                        }
                        
                    }else{
                        $("#data-table-div").css("display","none");
                        $("#error-message-div").css("display","block");
                        $("#display-status").html(data.status);
                        $("#error-msg").html(data.message);
                    }
                })
            startDate.value="";
            endDate.value="";
            startTime.value="";
            endTime.value=""
        }
    })

})