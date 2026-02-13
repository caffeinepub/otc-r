import Int "mo:core/Int";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";

import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type ArticleCategory = {
    #news;
    #results;
    #rumors;
    #events;
  };

  public type Article = {
    id : Nat32;
    promotion : Text;
    category : ArticleCategory;
    publishDate : Time.Time;
    imageUrl : Text;
    summary : Text;
    content : Text;
  };

  module Article {
    public func compare(a1 : Article, a2 : Article) : Order.Order {
      Int.compare(a2.publishDate, a1.publishDate);
    };
  };

  public type UserProfile = {
    favoritePromotions : [Text];
    rumorAlerts : Bool;
    breakingNewsAlerts : Bool;
    darkMode : Bool;
    savedArticles : [Nat32];
    readingHistory : [Nat32];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var articles = Map.empty<Nat32, Article>();

  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };
  };

  public query func getAllArticles() : async [Article] {
    let articlesList = articles.values().toArray();
    articlesList.sort();
  };

  public query func getArticlesByPromotion(promotion : Text) : async [Article] {
    let filtered = articles.values().toArray().filter(
      func(article) {
        article.promotion == promotion;
      }
    );
    filtered.sort();
  };

  public query func getArticlesByCategory(category : ArticleCategory) : async [Article] {
    let filtered = articles.values().toArray().filter(func(article) { article.category == category });
    filtered.sort();
  };

  public query func getArticlesByPromotionAndCategory(promotion : Text, category : ArticleCategory) : async [Article] {
    let filtered = articles.values().toArray().filter(
      func(article) {
        article.promotion == promotion and article.category == category
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getSavedArticles() : async [Article] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saved articles");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    let savedArticles = List.empty<Article>();
    for (articleId in userProfile.savedArticles.values()) {
      switch (articles.get(articleId)) {
        case (null) {};
        case (?article) { savedArticles.add(article) };
      };
    };
    let articlesArray = savedArticles.values().toArray();
    articlesArray.sort();
  };

  public query ({ caller }) func getReadingHistory() : async [Article] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reading history");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    let historyArticles = List.empty<Article>();

    for (articleId in userProfile.readingHistory.values()) {
      switch (articles.get(articleId)) {
        case (null) {};
        case (?article) { historyArticles.add(article) };
      };
    };
    let articlesArray = historyArticles.values().toArray();
    articlesArray.sort();
  };

  public query func getArticleById(articleId : Nat32) : async ?Article {
    articles.get(articleId);
  };

  public query func getArticlePreviewImage(articleId : Nat32) : async Text {
    switch (articles.get(articleId)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article.imageUrl };
    };
  };

  public shared ({ caller }) func uploadArticle(article : Article) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload articles");
    };
    articles.add(article.id, article);
  };

  public shared ({ caller }) func deleteArticle(articleId : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    articles.remove(articleId);
  };

  func containsIgnoreCase(text : Text, searchText : Text) : Bool {
    let t = text.toLower();
    let search = searchText.toLower();
    t.contains(#text search);
  };

  public query func searchArticles(searchText : Text) : async [Article] {
    let filtered = articles.values().toArray().filter(func(article) { containsIgnoreCase(article.content, searchText) });
    filtered.sort();
  };
};
