var lsm = {
    models: null,
    types: null,
    autoSaveConfig: {
        auto: false,
        interval: 5000
    },
    load() {
        if (localStorage.getItem(this.dbname)) {
            this.db = JSON.parse(localStorage.getItem(this.dbname));
            return true;
        }
        return false;
    },
    getEntity(entity) {
        return this.types.find(e => e.name == entity);
    },
    set(entities, type) {
        if (this.db == null) {
            if (localStorage.getItem(this.dbname)) {
                this.db = JSON.parse(localStorage.getItem(this.dbname));
                if (this.db == null)
                    this.db = {};
            } else this.db = {};
        }
        if (this.getEntity(type).type === "item") {
            this.db[type] = entities;
        } else if (this.getEntity(type).type === "list") {            
            if (this.db[type] == null) {
                this.db[type] = [];
            }

            if (entities instanceof Array) {

                entities.forEach(element => {
                    this.db[type].push(element);
                });
            } else {
                this.db[type].push(entities);
            }
        }
    },
    clear(type) {
        if (this.db != null) {
            if (this.getEntity(type).type === "item") {
                this.db[type] = {};
            } else {
                this.db[type] = [];
            }
        }
    },
    get(type) {
        if (this.db != null) {
            if (this.db[type])
                return this.db[type];
            return null;
        }
        return null;
    },
    update(model, type) {

        if (model != null && model.id && this.db != null) {
            if (this.getEntity(type).type === "item") {
                if (this.db[type].id == model.id) {
                    this.db[type] = model;
                    return true;
                }
                return false;
            } else {
                var item = this.db[type].find(e => e.id == model.id);
                if (item != null) {
                    for (var p in item) {
                        if (item.hasOwnProperty(p))
                            if (p !== "id")
                                item[p] = model[p];
                    }
                    return true;
                }
                return false;
            }
        }
        return false;
    },
    remove(model, type) {
        if (model != null && model.id && this.db != null) {
            if (this.getEntity(type).type === "item") {
                this.db[type] = null;
                return true;
            } else {
                var item = this.db[type].find(e => e.id == model.id);
                console.log(this.db[type]);
                if (item != null) {
                    var index = this.db[type].indexOf(item);
                    this.db[type].splice(index, 1);
                    return true;
                }
                return false;
            }
        }
        return false;
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
    install: (Vue, config) => {
        lsm.models = config.entities;
        lsm.types = config.schema;

        Vue.prototype.$lsm = lsm;
    }
};