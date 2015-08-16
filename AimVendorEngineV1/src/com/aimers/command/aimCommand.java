package com.aimers.command;

import com.aimers.dbaccess.*;
import java.util.*;

public abstract class aimCommand{

	public abstract Object execute(HashMap myInfo,ConnectionManager dbcon);

}