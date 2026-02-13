import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    favoritePromotions : [Text];
    rumorAlerts : Bool;
    breakingNewsAlerts : Bool;
    darkMode : Bool;
    savedArticles : [Nat32];
    readingHistory : [Nat32];
  };

  type Article = {
    id : Nat32;
    promotion : Text;
    category : { #news; #results; #rumors; #events };
    publishDate : Int;
    imageUrl : Text;
    summary : Text;
    content : Text;
  };

  // This type represents the articleSubmissions Map that should be dropped during migration
  type ArticleSubmissions = Map.Map<Nat32, {
    id : Nat32;
    promotion : Text;
    category : { #news; #results; #rumors; #events };
    publishDate : Int;
    imageUrl : Text;
    summary : Text;
    content : Text;
    author : Principal;
    status : { #pending; #approved; #rejected };
  }>;

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    articles : Map.Map<Nat32, Article>;
    articleSubmissions : ArticleSubmissions;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    articles : Map.Map<Nat32, Article>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      articles = old.articles;
    };
  };
};
