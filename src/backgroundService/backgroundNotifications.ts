import stockServices from "@/services/stock.services";
import { useLimitAlertsStore } from "@/stores/limitAlertsStore";
import notifee from "@notifee/react-native";
import BackgroundFetch from "react-native-background-fetch";
import logger from "@/utils/logger";

const setBackgroundNotificationTask = async (taskId: string) => {
    try {
        logger.debug('Background notification task started', { taskId });
        const limitAlerts = useLimitAlertsStore.getState().limitAlerts;
        
        await Promise.all(
            limitAlerts.map(async (alert) => {
                try {
                    const res = await stockServices.getStockQuote(alert.symbol);
                    if (res.c >= alert.limit) {
                        const channelId = await notifee.createChannel({
                            id: 'default',
                            name: 'Default Channel',
                        });

                        await notifee.displayNotification({
                            title: 'Stock Alert',
                            body: `The stock ${alert.symbol} has reached the limit of ${alert.limit}`,
                            android: {
                                channelId: channelId,
                            }
                        });
                    }
                } catch (error) {
                    logger.error(`Failed to check alert for ${alert.symbol}`, error);
                }
            })
        );
        
        logger.debug('Background notification task finished');
    } catch (error) {
        logger.error('Background notification task failed', error);
    } finally {
        BackgroundFetch.finish(taskId);
    }
};

export default setBackgroundNotificationTask;
