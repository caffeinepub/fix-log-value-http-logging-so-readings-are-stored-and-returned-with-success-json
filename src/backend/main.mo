import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Array "mo:core/Array";

(with migration = Migration.run)
actor {
  type Reading = {
    id : Nat;
    value : Float;
    timestamp : Time.Time;
  };

  type ReadingDTO = {
    value : Float;
    timestamp : Time.Time;
  };

  func toDTO(reading : Reading) : ReadingDTO {
    {
      value = reading.value;
      timestamp = reading.timestamp;
    };
  };

  type ReadingId = Nat;

  var nextId : ReadingId = 0;

  let readings = Map.empty<ReadingId, Reading>();

  public shared ({ caller }) func addReading(value : Float) : async Reading {
    let reading : Reading = {
      id = nextId;
      value;
      timestamp = Time.now();
    };
    readings.add(nextId, reading);
    nextId += 1;
    reading;
  };

  public query ({ caller }) func getAllReadings() : async [Reading] {
    readings.toArray().map(func((id, reading)) { reading });
  };

  public query ({ caller }) func getLatestReading() : async Reading {
    let lastId = if (nextId > 0) {
      nextId - 1;
    } else {
      Runtime.trap("Reading map is empty. No readings available!");
    };
    switch (readings.get(lastId)) {
      case (null) { Runtime.trap("Reading map is out of sync with nextId value. No reading at lastId does not exist.") };
      case (?reading) { reading };
    };
  };

  func buildReadingDTOArray(readingsArray : [Reading]) : [ReadingDTO] {
    readingsArray.map(func(reading) { toDTO(reading) });
  };

  type DataResponse = {
    readings : [ReadingDTO];
  };

  func buildDataResponse(readings : Map.Map<ReadingId, Reading>) : DataResponse {
    let readingsArray = readings.toArray().map(func((id, reading)) { reading });
    {
      readings = buildReadingDTOArray(readingsArray);
    };
  };

  public query ({ caller }) func sayHello(name : Text) : async Text {
    "Hello, " # name # "! Pleasure to meet you.";
  };
};
