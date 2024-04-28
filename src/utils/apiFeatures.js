export class ApiFeatures {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }


    paginate() {
        if (!this.queryData.page || this.queryData.page <= 0) {
            this.queryData.page = 1;
        }
        if (!this.queryData.size || this.queryData.size <= 0) {
            this.queryData.size = 3;
        }
        const skip = (parseInt(this.queryData.page) - 1) * parseInt(this.queryData.size);
        // this.page=page;
        this.mongooseQuery.limit(parseInt(this.queryData.size)).skip(skip);

        return this;
    }



    filter() {
        const excludeQueryParams = ['page', 'size', 'sort', 'search', 'fields'];

        const filterquery = { ... this.queryData };

        excludeQueryParams.forEach(element => {
            delete filterquery[element];
        });
        this.mongooseQuery.find(JSON.parse(JSON.stringify(filterquery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match => `$${match}`)));

        return this;
    }

    sort() {
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '));

        return this;
    }

    search() {

        if (this.queryData.keyword) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.keyword, $options: 'i' } },
                    { description: { $regex: this.queryData.keyword, $options: 'i' } },
                ]
            })
        }
        return this;
    }



    select() {
        this.mongooseQuery.select(this.queryData.fields?.replaceAll(',', " "));
        return this;
    }

}