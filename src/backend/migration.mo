import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Reading = {
    id : Nat;
    value : Float;
    timestamp : Time.Time;
  };

  type OldActor = {
    readings : Map.Map<Nat, Reading>;
    nextId : Nat;
  };

  type NewActor = {
    readings : Map.Map<Nat, Reading>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      readings = old.readings;
      nextId = old.nextId;
    };
  };
};
