import Int "mo:core/Int";
import Array "mo:core/Array";
import List "mo:core/List";

actor {
  type ChatMessage = {
    id : Nat;
    sender : Text;
    text : Text;
    timestamp : Int;
  };

  let messages = List.empty<ChatMessage>();
  var nextId = 0;

  public shared ({ caller }) func sendMessage(sender : Text, text : Text, timestamp : Int) : async () {
    let message : ChatMessage = {
      id = nextId;
      sender;
      text;
      timestamp;
    };

    messages.add(message);
    nextId += 1;
  };

  public query ({ caller }) func getMessages() : async [ChatMessage] {
    messages.toArray();
  };
};
