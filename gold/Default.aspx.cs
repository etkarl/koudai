using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
       // string strAction = System.Web.HttpUtility.UrlDecode(Request["action"]).ToString();
        string num =  DateTime.Now.Hour.ToString() + DateTime.Now.Minute + DateTime.Now.Second;
        //Response.Write("{ \"returnType\":1, \"msg\":\"成功\", \"result\":\""  + num +"\" }");
        Response.Write("{\"returnType\":1, \"msg\":\"成功\", \"name\":\"" + num + "\", \"conditionList\": [{\"variableId\":-3, \"variableType\":0, \"controlType\" :1 , \"condition\": \"2014-01-20\",\"conditionName\":\"2013-06-12\"},  {\"variableId\":-2, \"variableType\":0,\"controlType\" : 8 , \"condition\": \"天猫\",\"conditionName\":\"天猫\"},{\"variableId\":-1, \"variableType\":0, \"controlType\" :7 , \"condition\": \"1,2,3,4,5,6,7,8\",\"conditionName\":\"女装,数码,网游,服饰,箱包,母婴,男装,食品,家居,汽饰,彩妆,香水,数码,网游,服饰,箱包,母婴,男装,食品,家居,汽饰,彩妆,香水,数码,网游,服饰,箱包,母婴,男装,食品,家居,汽饰,彩妆,香水\"},{\"variableId\":1,  \"variableType\":1, \"controlType\" :1 , \"condition\": \"2013-06-12\",\"conditionName\":\"2013-06-12\",\"totalSaler\":9999}]}");
        Response.End();
        /*switch (strAction)
        {
            case "GoldSalerActionGetAccount":
                Response.Clear();
                Response.Write("{ \"returnType\":1, \"msg\":\"成功\", \"result\":\"9999\" }");
                Response.End();
                break;
            case "GoldSalerActionSave":
                Response.Clear();
                Response.Write("{ \"returnType\":1, \"msg\":\"成功\" }");
                Response.End();
                break;
        }*/
    }
}