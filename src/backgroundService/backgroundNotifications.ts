import stockServices from "@/services/stock.services";
import { useLimitAlertsStore } from "@/stores/limitAlertsStore";
import notifee from "@notifee/react-native";
import BackgroundFetch from "react-native-background-fetch";

const setBackgroundNotificationTask = async(taskId:string) =>{
    try{
        console.log('setBackgroundNotificationTask', taskId);
        const limitAlerts = useLimitAlertsStore.getState().limitAlerts;
        limitAlerts.forEach(async alert => {
            let res = await stockServices.getStockQuote(alert.symbol);
            if(res.c >= alert.limit){
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                })

                await notifee.displayNotification({
                    title: 'Stock Alert',
                    body: `The stock ${alert.symbol} has reached the limit of ${alert.limit}`,
                    android: {
                        channelId: channelId,
                    }
                })
            }
        })
        console.log('setBackgroundNotificationTask finished');
    }catch(error){
        console.log(error);
    }finally{
        BackgroundFetch.finish(taskId)
    }
}

export default setBackgroundNotificationTask;