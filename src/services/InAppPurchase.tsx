import * as RNIap from 'react-native-iap';

class InAppPurchases {
  purchaseUpdateSubscription: any;
  purchaseErrorSubscription: any;

  // initialize iap connection
  async init() {
    try {
      const result = await RNIap.initConnection();
      console.log('iap connection initialized', result);
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    } catch (error) {
      console.error('error initializing iap', error);
      if (error.message.includes('Billing is unavailable')) {
        console.log('Billing is unavailable. This may be due to using an emulator or Play Store issues.');
        // You might want to disable IAP features in your app when this occurs
      }
    }
  }

  // set up listeners
  setupListeners() {
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase: RNIap.ProductPurchase) => {
        console.log('purchase', purchase);
        // handle purchase
        // you might want to call a method to validate the purchase here
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

  // method to request purchase
  async requestPurchase(sku: string) {
    try {
      await RNIap.requestPurchase(sku);
    } catch (error) {
      console.error('error in requestPurchase', error);
    }
  }
}

export default new InAppPurchases();
