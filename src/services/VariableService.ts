import FileService from "./core/FileService";
import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";

export interface variable {
  id?: number
  pipeline_id?: number
  project_id?: number
  user_id?: number
  name?: string
  data?: any
  schema?: any
  description?: string
}

export interface assetUpload {
  id_variable: number
  var_name: string
  file_datas: Array<any>
}

export default {
  async addVariable(props: variable): Promise<any> {
    try {
      let query = SqlBricks.insert("variables", {
        id: props.id,
        pipeline_id: props.pipeline_id,
        project_id: props.project_id,
        user_id: props.user_id,
        name: props.name,
        data: JSON.stringify(props.data),
        schema: JSON.stringify(props.schema),
        description: props.description,
      });
      let resDataId = await SqlService.insert(query.toString());
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("variables").where({
        id: resDataId
      }).toString());

      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  async updateVariable(props: variable): Promise<any> {
    try {
      let query = SqlBricks.update("variables", {
        pipeline_id: props.pipeline_id,
        project_id: props.project_id,
        user_id: props.user_id,
        name: props.name,
        data: JSON.stringify(props.data),
        schema: JSON.stringify(props.schema),
        description: props.description,
      });
      query = query.where({
        "id": props.id,
        "user_id": props.user_id
      });
      await SqlService.update(query.toString());
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("variables").where({
        id: props.id,
        user_id: props.user_id
      }).toString());
      for (let a = 0; a < props.data.length; a++) {
        let tabs = props.data[a];
        for (let b = 0; b < tabs.datas.length; b++) {
          let _data = tabs.datas[b];
          if (_data.attachment_datas != null) {
            for (let c = 0; c < _data.attachment_datas.length; c++) {
              let _item = _data.attachment_datas[c];
              let _formData = new FormData();
              _formData.append("from_path", _item.file[0].path);
              _formData.append("to_path", "./storage/app/variables/" + props.id + "/" + _item.file[0].name)
              let resMove = await FileService.move(_formData);
            }
          }
          if (_data.attachment_datas_deleted != null) {
            for (let c = 0; c < _data.attachment_datas_deleted.length; c++) {
              let _item = _data.attachment_datas_deleted[c];
              let _formData = new FormData();
              _formData.append("delete_path", "./storage/app/variables/" + props.id + "/" + _item.file[0].name)
              let resDelete = await FileService.delete(_formData);
            }
          }
        }
      }
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getVariables(props): Promise<any> {
    try {
      SqlBricks.aliasExpansions({
        "vari": "variables",
        "pip": "pipelines",
        "pro": "projects"
      });

      let query = SqlBricks.select(
        "vari.id as id",
        "vari.name as name",
        "vari.pipeline_id as pipeline_id",
        "vari.project_id as project_id",
        "vari.user_id as user_id",
        "vari.description as description",
        "vari.schema as schema",
        "vari.data as data",
        "pip.id as pip_id",
        "pip.name as pip_name",
        "pip.description as pip_description",
        "pro.id as pro_id",
        "pro.name as pro_name",
        "pro.description as pro_description"
      );

      query = query.from("vari");
      query = query
        .leftJoin("pip").on("pip.id", "vari.pipeline_id")
        .leftJoin("pro").on("pro.id", "pip.project_id");

      // Where segment
      if (props.pipeline_id != null) {
        query = query.where("pip.id", props.pipeline_id);
      }
      let resDatas: Array<any> = await SqlService.select(query.toString());
      resDatas.forEach((resData) => {
        resData.data = JSON.parse(resData.data);
        resData.schema = JSON.parse(resData.schema);
        return resData;
      })
      return {
        status: 'success',
        status_code: 200,
        return: resDatas
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getVariable(props: variable): Promise<any> {
    try {
      SqlBricks.aliasExpansions({
        "vari": "variables",
        "pip": "pipelines",
        "pro": "projects"
      });

      let query = SqlBricks.select(
        "vari.id as id",
        "vari.name as name",
        "vari.pipeline_id as pipeline_id",
        "vari.project_id as project_id",
        "vari.user_id as user_id",
        "vari.description as description",
        "vari.schema as schema",
        "vari.data as data",
        "pip.id as pip_id",
        "pip.name as pip_name",
        "pip.description as pip_description",
        "pro.id as pro_id",
        "pro.name as pro_name",
        "pro.description as pro_description"
      );

      query = query.from("vari");
      query = query
        .leftJoin("pip").on("pip.id", "vari.pipeline_id")
        .leftJoin("pro").on("pro.id", "pip.project_id");

      query = query.where({
        "vari.id": props.id,
        "vari.user_id": props.user_id
      });

      query = query.limit(1);
      let resData = await SqlService.selectOne(query.toString());
      resData.data = JSON.parse(resData.data);
      resData.schema = JSON.parse(resData.schema);
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async deleteVariable(ids: Array<number>): Promise<any> {
    try {
      let _in: Array<any> | string = [
        ...ids
      ];
      _in = _in.join(',');
      let resData = await SqlService.delete(SqlBricks.delete('variables').where(SqlBricks.in("id", _in)).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async uploadAsset(props: assetUpload) {
    try {
      let formData = new FormData();

      formData.append("id_variable", props.id_variable + "");
      formData.append("var_name", props.var_name);
      for (var a = 0; a < props.file_datas.length; a++) {
        formData.append("file_datas[]", props.file_datas[a].file[0] as any);
      }
      let resData = await FileService.upload(formData);
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  }
}