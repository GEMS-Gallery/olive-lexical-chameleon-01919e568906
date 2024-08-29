import Int "mo:base/Int";
import Text "mo:base/Text";

import Float "mo:base/Float";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor {
  stable var lastPrice: ?Float = null;
  stable var lastUpdateTime: Int = 0;

  public func getBitcoinPrice(): async ?Float {
    return lastPrice;
  };

  public func updatePrice(): async () {
    // In a real-world scenario, this would make an HTTP outcall to fetch the price
    // For this example, we'll simulate a price update with a random value
    let currentTime = Time.now();
    let simulatedPrice = 30000.0 + Float.fromInt(currentTime % 1000);
    lastPrice := ?simulatedPrice;
    lastUpdateTime := currentTime;
    Debug.print("Updated Bitcoin price: " # Float.toText(simulatedPrice));
  };

  public query func getLastUpdateTime(): async Int {
    return lastUpdateTime;
  };

  // Update the price every 5 minutes
  system func heartbeat() : async () {
    if (lastPrice == null or Time.now() - lastUpdateTime > 5 * 60 * 1000_000_000) {
      try {
        await updatePrice();
      } catch (e) {
        Debug.print("Error updating price: " # Error.message(e));
      };
    };
  };
}