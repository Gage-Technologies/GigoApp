import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSubscriptions, ProductPurchase, Purchase} from 'react-native-iap';
import Config from 'react-native-config';
import {Platform} from 'react-native';

const API_URL = Config.API_URL;
// const PRO_UPGRADE_SKU_BASIC = Config.GIGO_PRO_UPGRADE_BASIC;
// const PRO_UPGRADE_SKU_ADVANCED = Config.GIGO_PRO_UPGRADE_ADVANCED;
// const PRO_UPGRADE_SKU_MAX = Config.GIGO_PRO_UPGRADE_MAX;

class InAppPurchases {
  purchaseUpdateSubscription: any;
  purchaseErrorSubscription: any;

  // initialize iap connection
  async init() {
    try {
      // attempt to initialize the iap connection
      const result = await RNIap.initConnection();
      console.log('iap connection initialized', result);

      // flush any failed purchases on android
      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }

      // get available products (define these)
      const products = await RNIap.getSubscriptions({
        skus: [
          'gigo_pro_subscription_basic',
          'gigo_pro_subscription_advanced',
          'gigo_pro_subscription_max',
        ],
      });
      console.log('available products:', products);

      return true; // return true if initialization was successful
    } catch (error) {
      console.error('error initializing iap', error);
      // @ts-ignore
      if (error.message.includes('Billing is unavailable')) {
        console.log(
          'Billing is unavailable. This may be due to using an emulator or Play Store issues.',
        );

        return false; // return false to indicate initialization failed
      }
      throw error; // rethrow other errors
    }
  }

  async updatePurchaseTokenOnServer(purchaseToken: string) {
    try {
      const response = await fetch(`${API_URL}/api/google/upgradePro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseToken: purchaseToken,
          // Add any other necessary data, such as user ID
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error making API call: ', error);
    }
  }

  // PRO_UPGRADE_SKU_BASIC = Config.GIGO_PRO_UPGRADE_BASIC;
  // PRO_UPGRADE_SKU_ADVANCED = Config.GIGO_PRO_UPGRADE_ADVANCED;
  // PRO_UPGRADE_SKU_MAX = Config.GIGO_PRO_UPGRADE_MAX;

  // set up listeners
  setupListeners() {
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase: Purchase | ProductPurchase) => {
        console.log('purchase', purchase);

        if (purchase.transactionReceipt && purchase.purchaseToken) {
          // Grant Pro features to the user
          await AsyncStorage.setItem('isPro', 'true');
          console.log('Pro upgrade purchased successfully');
          const googlePurchaseToken = purchase.purchaseToken;

          // Acknowledge the purchase to Google Play Store
          try {
            await this.updatePurchaseTokenOnServer(googlePurchaseToken);
            if (purchase.transactionReceipt) {
              await RNIap.finishTransaction({
                purchase: purchase,
                isConsumable: false,
                developerPayloadAndroid: '',
              });
            }
          } catch (error) {
            console.error('Error finishing transaction', error);
          }
        }
        //
        // else if (
        //   purchase.productId === 'gigo_pro_subscription_advanced' &&
        //   purchase.transactionReceipt
        // ) {
        //   // Grant Pro features to the user
        //   await AsyncStorage.setItem('isPro', 'true');
        //   console.log('Pro upgrade purchased successfully');
        //   const googlePurchaseToken = purchase.purchaseToken;
        //
        //   // Acknowledge the purchase to Google Play Store
        //   try {
        //     await this.updatePurchaseTokenOnServer(googlePurchaseToken);
        //     if (purchase.transactionReceipt) {
        //       await RNIap.finishTransaction({
        //         purchase: purchase,
        //         isConsumable: false,
        //         developerPayloadAndroid: '',
        //       });
        //     }
        //   } catch (error) {
        //     console.error('Error finishing transaction', error);
        //   }
        // } else if (
        //   purchase.productId === 'gigo_pro_subscription_max' &&
        //   purchase.transactionReceipt
        // ) {
        //   // Grant Pro features to the user
        //   await AsyncStorage.setItem('isPro', 'true');
        //   console.log('Pro upgrade purchased successfully');
        //   const googlePurchaseToken = purchase.purchaseToken;
        //
        //   // Acknowledge the purchase to Google Play Store
        //   try {
        //     await this.updatePurchaseTokenOnServer(googlePurchaseToken);
        //     if (purchase.transactionReceipt) {
        //       await RNIap.finishTransaction({
        //         purchase: purchase,
        //         isConsumable: false,
        //         developerPayloadAndroid: '',
        //       });
        //     }
        //   } catch (error) {
        //     console.error('Error finishing transaction', error);
        //   }
        // }
      },
    );

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error: RNIap.PurchaseError) => {
        console.error('purchaseErrorListener', error);
      },
    );
  }

  // remove listeners
  removeListeners() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  // async fetchSubscriptions () {
  //   try {
  //     const subscriptions = await getSubscriptions({
  //       skus: [
  //         'gigo_pro_subscription_basic',
  //         'gigo_pro_subscription_advanced',
  //         'gigo_pro_subscription_max',
  //       ],
  //     });
  //     console.log('Available subscriptions:', subscriptions);
  //     return subscriptions;
  //   } catch (error) {
  //     console.error('Error fetching subscriptions:', error);
  //   }
  // }

  // method to request purchase
  // async requestPurchase(sku: string) {
  //   try {
  //     console.log("sku is: ", sku)
  //     await RNIap.requestSubscription({sku: sku});
  //   } catch (error) {
  //     console.error('error in requestPurchase', error);
  //   }
  // }

  async requestPurchase(sku: string) {
    try {
      const subscriptions = await getSubscriptions({
        skus: [
          'gigo_pro_subscription_basic',
          'gigo_pro_subscription_advanced',
          'gigo_pro_subscription_max',
        ],
      });

      // Find the subscription product by its SKU
      const selectedSubscription = subscriptions.find(
        sub => sub.productId === sku,
      );
      if (!selectedSubscription) {
        throw new Error('Subscription product not found');
      }

      let offer;

      console.log('selected subscription: ', selectedSubscription);

      // Choose the first offer for simplicity (or customize based on your needs)
      if ('subscriptionOfferDetails' in selectedSubscription) {
        console.log('in here');
        offer = selectedSubscription.subscriptionOfferDetails[0];
      } // Assuming one offer per subscription for now

      if (!offer) {
        throw new Error('No offer available for this subscription');
      }

      // Request subscription using the SKU and the subscriptionOffers (base plan and offer token)
      await RNIap.requestSubscription({
        sku: selectedSubscription.productId, // This is the subscription product ID
        subscriptionOffers: [
          {
            sku: selectedSubscription.productId, // Base plan ID from the offer
            offerToken: offer.offerToken, // Offer token associated with the base plan
          },
        ],
      });
    } catch (error) {
      console.error('Error in requestSubscription:', error);
    }
  }

  // check if billing is available
  async isBillingAvailable() {
    try {
      const available = await RNIap.initConnection();
      return available;
    } catch (error) {
      console.error('error checking billing availability', error);
      return false;
    }
  }
}

export default new InAppPurchases();
