var lsm = {
  autoSaveConfig: {
    auto: true,
    interval: 5000
  },
  entities: [
    {
      name: "categories",
      type: "list"
    },
    {
      name: "items",
      type: "list"
    },
    {
      name: "profile",
      type: "item"
    }
  ],
  getEntity(entity) {
    return this.entities.find(e => e.name == entity);
  },
  db: null,
  dbname: "default",
  setDbName: function(name) {
    this.dbname = name;
  },
  getDb: function() {
    return JSON.parse(localStorage.getItem(this.dbname));
  },
  saveItemByKey: function(key, value) {
    //let item = JSON.stringify(value);
    localStorage.setItem(key, value);
  },
  autoSaveConfiguration() {
    return this.autosaveConfig;
  },
  setAutoSaveConfig(config) {
    this.autoSaveConfig = config;
  },
  autoSave() {
    if (this.autoSaveConfig.auto) {
      let self = this;
      var interval = setInterval(function() {
        let content = JSON.stringify(self.db);
        localStorage.setItem(self.dbname, content);
      }, this.autoSaveConfig.interval);
    }
  },
  set(entities, type) {
    if (this.db == null) {
      if (localStorage.getItem(this.dbname))
        this.db = JSON.parse(localStorage.getItem(this.dbname));
      else this.db = {};
    }
    if (this.getEntity(type).type === "item") {
      this.db.type = entities;
    } else if (this.getEntity(type).type === "list") {
      if (this.db.type == null) {
        this.db.type = [];
      }
      entities.forEach(element => {
        this.db.type.push(entities);
      });
    }
  },
  get(type) {
    if (this.db == null) {
      if (localStorage.getItem(this.dbname))
        this.db = localStorage.getItem(this.dbname);
    }
    if (this.db == null) return null;
    else {
      return this.db.type;
    }
  },
  refresh() {
    this.db = JSON.parse(localStorage.getItem(this.dbname));
  },
  save() {
    localStorage.setItem(this.dbname, JSON.stringify(this.db));
    if (this.autoSaveConfig.auto) {
      this.autoSave();
    }
  }  
};

export default {
  install: (Vue) => {
    Vue.prototype.$lsm = lsm;
  }
};
