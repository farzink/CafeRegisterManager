var lsm = {
    autoSaveConfig: {
        auto: true,
        interval: 5000
    },
    entitties: [{
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
        return find(this.entitties(e => e.name == entity));
    },
    db,
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
    autoSave() {
        return this.autosaveConfig;
    },
    setAutoSaveConfig(config) {
        this.autoSaveConfig = config;
    },
    autoSave() {
        if (this.autoSaveConfig.auto) {
            var interval = setInterval(function() {
                    localStorage.setItem(this.dbname, JSON.stringify(this.db));
                },
                this.autoSaveConfig.interval);
        };
    },
    set(entities, type) {
        if (db == null) {
            if (localStorage.getItem(this.dbname))
                this.db = JSON.parse(localStorage.getItem(this.dbname));
            else
                this.db = {};
        }
        if (this.getEntity(type).type === "item") {
            this.db.type = entities;
        } else if (this.getEntity(type).type === "list") {
            if (this.db.type == null) {
                this.db.type = [];
            }
            entities.forEach(element => {
                this.type.push(entities);
            });
        }
    },
    get(type) {
        if (this.db == null) {
            if (localStorage.getItem(this.dbname))
                this.db = localStorage.getItem(this.dbname);
        }
        if (this.db == null)
            return null;
        else {
            return this.db.type;
        }
    },
    refresh() {
        this.db = JSON.parse(localStorage.getItem(this.dbname));
    },
    save() {
        localStorage.setItem(this.dbname, JSON.stringify(this.db));
        if (this.autosaveConfig.auto) {
            this.autoSave();
        }
    }
}

module.exports.install = (Vue) => {
    Vue.prototype.$lsm = lsm;
};