import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap';

class InAppPurchases {
  purchaseUpdateSubscription: any;
  purchaseErrorSubscription: any;

  // initialize iap connection
  async init() {
    try {
      await RNIap.initConnection();
      console.log('iap connection initialized');
    } catch (error) {
      console.error('error initializing iap', error);
    }
  }

  // set up listeners
  setupListeners() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        console.log('purchase', purchase);
        // handle purchase
        // you might want to call a method to validate the purchase here
      },
    );

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
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
